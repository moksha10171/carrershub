import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Middleware helper to check if user is authenticated
 * @param  request - Next.js request object
 * @returns User object if authenticated, null otherwise
 */
export async function requireAuth(request: NextRequest) {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return { user: null, error: 'Unauthorized' };
    }

    return { user, error: null };
}

/**
 * Helper to return unauthorized response
 */
export function unauthorizedResponse() {
    return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
    );
}

/**
 * Helper to check if user has permission for a company
 * @param userId - User ID to check
 * @param companyId - Company ID to check access for
 * @returns boolean - true if user has access
 */
export async function hasCompanyAccess(userId: string, companyId: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    // Check if user owns this company
    const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('id', companyId)
        .eq('user_id', userId)  // Using user_id to match schema
        .single();

    return !!data && !error;
}

/**
 * Helper to get user's company
 * @param userId - User ID
 * @returns Company object or null
 */
export async function getUserCompany(userId: string) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

/**
 * Helper to get user's company by slug
 * @param userId - User ID
 * @param slug - Company slug
 * @returns Company object or null
 */
export async function getUserCompanyBySlug(userId: string, slug: string) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

