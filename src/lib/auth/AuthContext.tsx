'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error: error.message };
            }

            return { error: null };
        } catch (error) {
            return { error: 'An unexpected error occurred' };
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) {
                return { error: error.message };
            }

            return { error: null };
        } catch (error) {
            return { error: 'An unexpected error occurred' };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const value = {
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Demo mode auth for when Supabase is not configured
export function useDemoAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);

    useEffect(() => {
        // Check localStorage for demo auth
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
            setUser(JSON.parse(demoUser));
            setIsAuthenticated(true);
        }
    }, []);

    const signIn = async (email: string, password: string) => {
        // Demo login - accept any credentials
        const demoUser = { email, name: email.split('@')[0] };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        setIsAuthenticated(true);
        return { error: null };
    };

    const signUp = async (email: string, password: string, name: string) => {
        const demoUser = { email, name };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        setIsAuthenticated(true);
        return { error: null };
    };

    const signOut = async () => {
        localStorage.removeItem('demo_user');
        setUser(null);
        setIsAuthenticated(false);
    };

    return {
        user,
        isAuthenticated,
        isLoading: false,
        signIn,
        signUp,
        signOut,
    };
}
