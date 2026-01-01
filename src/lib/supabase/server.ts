import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createServerSupabaseClient() {
    // Fallback for build-time when Supabase isn't configured
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables not set, using mock client');
        return {
            from: () => ({
                select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                update: () => ({ error: { message: 'Supabase not configured' } }),
                delete: () => ({ error: { message: 'Supabase not configured' } }),
                eq: function () { return this; },
                single: function () { return this; },
            }),
            auth: {
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            },
        } as any;
    }

    try {
        const cookieStore = await cookies();

        return createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value, ...options });
                        } catch (error) {
                            // Cookie setting errors in server components are expected
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options });
                        } catch (error) {
                            // Cookie removal errors in server components are expected
                        }
                    },
                },
            }
        );
    } catch (error) {
        console.warn('Failed to create Supabase client:', error);
        // Return a mock client for static generation
        return {
            from: () => ({
                select: () => ({ data: null, error: { message: 'Static generation' } }),
                insert: () => ({ data: null, error: { message: 'Static generation' } }),
                update: () => ({ error: { message: 'Static generation' } }),
                delete: () => ({ error: { message: 'Static generation' } }),
                eq: function () { return this; },
                single: function () { return this; },
            }),
            auth: {
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            },
        } as any;
    }
}
