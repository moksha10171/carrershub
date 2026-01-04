/**
 * Rate limiting utility using Upstash Redis
 * Protects API routes from abuse and DDoS attacks
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

/**
 * Rate limit configurations for different endpoint types
 */
export const rateLimitConfigs = {
    // Strict limits for mutations
    strict: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        prefix: "ratelimit:strict",
    }) : null,

    // Moderate limits for reads
    moderate: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "10 s"),
        analytics: true,
        prefix: "ratelimit:moderate",
    }) : null,

    // Lenient limits for public endpoints
    lenient: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "10 s"),
        analytics: true,
        prefix: "ratelimit:lenient",
    }) : null,

    // Auth endpoints (prevent brute force)
    auth: redis ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"),
        analytics: true,
        prefix: "ratelimit:auth",
    }) : null,
};

/**
 * Get identifier for rate limiting (IP or user ID)
 */
function getIdentifier(request: NextRequest, userId?: string): string {
    if (userId) {
        return `user:${userId}`;
    }

    // Get IP from various headers (Vercel, Cloudflare, default)
    const ip =
        request.headers.get('x-real-ip') ??
        request.headers.get('x-forwarded-for')?.split(',')[0] ??
        '127.0.0.1';

    return `ip:${ip}`;
}

/**
 * Apply rate limiting to a request
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @param userId - Optional user ID for user-based limiting
 * @returns true if request is allowed, false if rate limited
 */
export async function checkRateLimit(
    request: NextRequest,
    config: keyof typeof rateLimitConfigs = 'moderate',
    userId?: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
    const ratelimiter = rateLimitConfigs[config];

    // If rate limiting not configured (development), allow all requests
    if (!ratelimiter) {
        return { success: true };
    }

    const identifier = getIdentifier(request, userId);
    const { success, limit, remaining, reset } = await ratelimiter.limit(identifier);

    return { success, limit, remaining, reset };
}

/**
 * Middleware wrapper for rate limiting
 * Returns 429 response if rate limit exceeded
 */
export async function withRateLimit(
    request: NextRequest,
    config: keyof typeof rateLimitConfigs = 'moderate',
    userId?: string
): Promise<NextResponse | null> {
    const { success, limit, remaining, reset } = await checkRateLimit(request, config, userId);

    if (!success) {
        return NextResponse.json(
            {
                success: false,
                error: 'Too many requests. Please try again later.',
                limit,
                remaining: 0,
                reset,
            },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit?.toString() || '0',
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': reset?.toString() || '0',
                    'Retry-After': reset ? Math.ceil((reset - Date.now()) / 1000).toString() : '60',
                },
            }
        );
    }

    return null; // Rate limit passed
}

/**
 * Helper to add rate limit headers to successful responses
 */
export function addRateLimitHeaders(
    response: NextResponse,
    result: { limit?: number; remaining?: number; reset?: number }
): NextResponse {
    if (result.limit) {
        response.headers.set('X-RateLimit-Limit', result.limit.toString());
    }
    if (result.remaining !== undefined) {
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    }
    if (result.reset) {
        response.headers.set('X-RateLimit-Reset', result.reset.toString());
    }
    return response;
}
