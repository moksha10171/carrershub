import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

/**
 * Exit preview mode
 * GET /api/preview/exit
 */
export async function GET(request: NextRequest) {
    // Disable draft mode (clears cookie)
    (await draftMode()).disable();

    // Get return URL or default to dashboard
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get('return') || '/dashboard';

    return NextResponse.redirect(new URL(returnUrl, request.url));
}
