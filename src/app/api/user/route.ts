import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';

export async function DELETE(request: NextRequest) {
    try {
        // 1. Verify the user is authenticated
        const { user, error: authError } = await requireAuth(request);
        if (authError || !user) {
            return unauthorizedResponse();
        }

        // 2. Check for Service Role Key
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is not defined');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // 3. Create Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 4. Delete the User
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
            user.id
        );

        if (deleteError) {
            console.error('Failed to delete user:', deleteError);
            return NextResponse.json(
                { success: false, error: 'Failed to delete account' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error: any) {
        console.error('User DELETE error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
