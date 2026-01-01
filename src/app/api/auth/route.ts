import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo (use Supabase in production)
const demoAuth: Record<string, { email: string; password: string; name: string; companyId?: string }> = {
    'demo@example.com': {
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo Recruiter',
        companyId: 'demo-company-id',
    },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, email, password, name } = body;

        switch (action) {
            case 'login': {
                // Demo login validation
                const user = demoAuth[email];

                if (!user || user.password !== password) {
                    // For demo: allow any login
                    return NextResponse.json({
                        success: true,
                        data: {
                            user: {
                                id: 'demo-user-' + Date.now(),
                                email,
                                name: email.split('@')[0],
                            },
                            session: {
                                access_token: 'demo-token-' + Date.now(),
                                expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                            },
                        },
                    });
                }

                return NextResponse.json({
                    success: true,
                    data: {
                        user: {
                            id: 'demo-user-' + email,
                            email: user.email,
                            name: user.name,
                            companyId: user.companyId,
                        },
                        session: {
                            access_token: 'demo-token-' + Date.now(),
                            expires_at: Date.now() + 24 * 60 * 60 * 1000,
                        },
                    },
                });
            }

            case 'signup': {
                // Demo signup - accept all
                if (!email || !password || !name) {
                    return NextResponse.json(
                        { success: false, error: 'Email, password and name are required' },
                        { status: 400 }
                    );
                }

                // Create new user (in demo, just return success)
                return NextResponse.json({
                    success: true,
                    data: {
                        user: {
                            id: 'new-user-' + Date.now(),
                            email,
                            name,
                        },
                        message: 'Account created successfully',
                    },
                });
            }

            case 'logout': {
                return NextResponse.json({
                    success: true,
                    message: 'Logged out successfully',
                });
            }

            case 'check_session': {
                // Demo: Always return valid session if token provided
                const token = body.token;
                if (token) {
                    return NextResponse.json({
                        success: true,
                        data: {
                            valid: true,
                            user: {
                                id: 'demo-user',
                                email: 'demo@example.com',
                                name: 'Demo User',
                            },
                        },
                    });
                }
                return NextResponse.json({
                    success: false,
                    data: { valid: false },
                });
            }

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { success: false, error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
