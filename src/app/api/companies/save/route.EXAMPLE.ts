import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth, unauthorizedResponse } from '@/lib/api/auth';
import { SaveDraftRequestSchema, validateRequest, formatValidationErrors } from '@/lib/validation/schemas';
import { withRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/ratelimit';

/**
 * IMPROVED: Save company changes to draft with validation and rate limiting
 */
export async function POST(request: NextRequest) {
    // 1. RATE LIMITING (strict - 10 requests per 10 seconds)
    const rateLimitResult = await withRateLimit(request, 'strict');
    if (rateLimitResult) {
        return rateLimitResult; // Return 429 if rate limited
    }

    // 2. AUTHENTICATION
    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        // 3. PARSE & VALIDATE REQUEST BODY
        const body = await request.json();
        const validation = validateRequest(SaveDraftRequestSchema, body);

        if (!validation.success) {
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                errors: formatValidationErrors(validation.errors)
            }, { status: 400 });
        }

        const { company, settings, sections } = validation.data;

        const supabase = await createServerSupabaseClient();

        // 4. VERIFY OWNERSHIP
        const { data: existingCompany } = await supabase
            .from('companies')
            .select('id, user_id')
            .eq('id', company.id!)
            .single();

        if (!existingCompany || existingCompany.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Not authorized' },
                { status: 403 }
            );
        }

        // 5. CHECK FOR CONFLICTS (version tracking - optional)
        let currentPublished = null;
        let existingDraft = null;

        try {
            const { data: publishedData } = await supabase
                .from('companies')
                .select('version')
                .eq('id', company.id!)
                .single();
            currentPublished = publishedData;

            const { data: draftData } = await supabase
                .from('draft_companies')
                .select('base_version, version')
                .eq('company_id', company.id!)
                .single();
            existingDraft = draftData;

            if (existingDraft && currentPublished) {
                const publishedVersion = currentPublished.version || 1;
                const draftBaseVersion = existingDraft.base_version || 1;

                if (publishedVersion > draftBaseVersion) {
                    return NextResponse.json({
                        success: false,
                        conflict: true,
                        error: 'Content was published by another user. Please review changes before continuing.',
                        publishedVersion,
                        draftBaseVersion
                    }, { status: 409 });
                }
            }
        } catch (versionError) {
            // Version tracking columns may not exist in older databases
            // Silently continue without version tracking
        }

        // 6. SAVE DRAFT
        const draftData: any = {
            company_id: company.id,
            user_id: user.id,
            company_data: company,
            settings_data: settings,
            sections_data: sections,
            updated_at: new Date().toISOString()
        };

        // Add version fields if supported
        if (currentPublished?.version !== undefined) {
            draftData.base_version = currentPublished.version || 1;
        }
        if (existingDraft?.version !== undefined) {
            draftData.version = (existingDraft.version || 0) + 1;
        }

        const { error: draftError } = await supabase
            .from('draft_companies')
            .upsert(draftData, {
                onConflict: 'company_id'
            });

        if (draftError) {
            console.error('Draft save error:', draftError);
            return NextResponse.json(
                { success: false, error: 'Failed to save draft' },
                { status: 500 }
            );
        }

        // 7. RETURN SUCCESS WITH RATE LIMIT HEADERS
        const response = NextResponse.json({
            success: true,
            message: 'Draft saved successfully',
            updatedAt: new Date().toISOString()
        });

        // Add rate limit headers to response
        const rateLimitInfo = await checkRateLimit(request, 'strict', user.id);
        return addRateLimitHeaders(response, rateLimitInfo);

    } catch (error: any) {
        console.error('Save draft error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * IMPROVED: Get draft data with caching headers
 */
export async function GET(request: NextRequest) {
    // Rate limiting (lenient for reads)
    const rateLimitResult = await withRateLimit(request, 'lenient');
    if (rateLimitResult) {
        return rateLimitResult;
    }

    const { user, error: authError } = await requireAuth(request);
    if (authError || !user) {
        return unauthorizedResponse();
    }

    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('company_id');

        if (!companyId) {
            return NextResponse.json(
                { success: false, error: 'Company ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Verify ownership
        const { data: company } = await supabase
            .from('companies')
            .select('id, user_id')
            .eq('id', companyId)
            .single();

        if (!company || company.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Not authorized' },
                { status: 403 }
            );
        }

        // Get draft data
        const { data: draft } = await supabase
            .from('draft_companies')
            .select('*')
            .eq('company_id', companyId)
            .single();

        const response = NextResponse.json({
            success: true,
            draft
        });

        // Add cache headers (short-lived for draft data)
        response.headers.set('Cache-Control', 'private, max-age=10');

        const rateLimitInfo = await checkRateLimit(request, 'lenient', user.id);
        return addRateLimitHeaders(response, rateLimitInfo);

    } catch (error: any) {
        console.error('Get draft error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
