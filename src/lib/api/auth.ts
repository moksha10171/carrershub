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

    // Check if user is associated with this company
    // In a real app, you'd have a company_users table
    const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('id', companyId)
        .eq('owner_id', userId)  // Assuming companies have an owner_id field
        .single();

    return !!data && !error;
}
