import { z } from 'zod';

/**
 * Validation schemas for API requests
 * Ensures data integrity and prevents invalid inputs
 */

// Company validation schema
export const CompanySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Company name is required').max(100),
    tagline: z.string().max(200).optional().nullable(),
    website: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
    logo_url: z.string().url().optional().nullable().or(z.literal('')),
    banner_url: z.string().url().optional().nullable().or(z.literal('')),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    user_id: z.string().uuid().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Company settings validation schema
export const CompanySettingsSchema = z.object({
    id: z.string().uuid().optional(),
    company_id: z.string().uuid().optional(),
    primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().nullable(),
    secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().nullable(),
    accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().nullable(),
    culture_video_url: z.string().url().optional().nullable().or(z.literal('')),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Content section validation schema
export const ContentSectionSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Section title is required').max(200),
    type: z.enum(['text', 'video', 'image', 'gallery', 'benefits', 'values', 'team']),
    content: z.string().max(10000),
    is_visible: z.boolean().default(true),
    display_order: z.number().int().min(0).optional(),
    company_id: z.string().uuid().optional(),
});

// Job validation schema
export const JobSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Job title is required').max(200),
    description: z.string().min(1, 'Job description is required').max(50000),
    location: z.string().min(1, 'Location is required').max(200),
    job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
    salary_min: z.number().int().min(0).optional().nullable(),
    salary_max: z.number().int().min(0).optional().nullable(),
    status: z.enum(['draft', 'active', 'closed']).default('active'),
    company_id: z.string().uuid(),
    requirements: z.array(z.string()).optional().default([]),
    responsibilities: z.array(z.string()).optional().default([]),
    benefits: z.array(z.string()).optional().default([]),
});

// Application validation schema
export const ApplicationSchema = z.object({
    job_id: z.string().uuid('Invalid job ID'),
    resume_url: z.string().url('Invalid resume URL'),
    cover_letter: z.string().max(5000).optional(),
    answers: z.record(z.string(), z.string()).optional(),
});

// Save draft request validation
export const SaveDraftRequestSchema = z.object({
    company: CompanySchema,
    settings: CompanySettingsSchema.optional(),
    sections: z.array(ContentSectionSchema).optional(),
});

// Publish request validation
export const PublishRequestSchema = z.object({
    company_id: z.string().uuid('Invalid company ID'),
});

// Pagination schema
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

// Search schema
export const SearchSchema = z.object({
    query: z.string().min(1).max(200),
    type: z.enum(['jobs', 'companies', 'all']).optional().default('all'),
    location: z.string().max(200).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(20),
});

/**
 * Helper function to validate and parse request body
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: z.ZodError;
} {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    } else {
        return { success: false, errors: result.error };
    }
}

/**
 * Format validation errors for API response
 */
export function formatValidationErrors(errors: z.ZodError): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    for (const error of errors.issues) {
        const path = error.path.join('.');
        if (!formatted[path]) {
            formatted[path] = [];
        }
        formatted[path].push(error.message);
    }

    return formatted;
}
