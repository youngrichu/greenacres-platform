'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updatePassword,
} from 'firebase/auth';
import { getFirebaseAuth } from '@greenacres/db';
import { getUserById, createUserProfile } from '@greenacres/db';
import type { User, UserRegistration, ApiResponse } from '@greenacres/types';

interface FirebaseError {
    code: string;
    message: string;
}

// ============================================
// AUTH CONTEXT TYPES
// ============================================

interface AuthState {
    firebaseUser: FirebaseUser | null;
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface AuthContextValue extends AuthState {
    signIn: (email: string, password: string) => Promise<ApiResponse<User>>;
    signUp: (data: UserRegistration) => Promise<ApiResponse<User>>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<ApiResponse<void>>;
    changePassword: (newPassword: string) => Promise<ApiResponse<void>>;
    refreshUser: () => Promise<void>;
}

// ============================================
// AUTH CONTEXT
// ============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// AUTH PROVIDER
// ============================================

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        firebaseUser: null,
        user: null,
        loading: true,
        error: null,
    });

    // Fetch user profile from Firestore
    const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
        try {
            const user = await getUserById(firebaseUser.uid);
            setState((prev) => ({
                ...prev,
                firebaseUser,
                user,
                loading: false,
                error: null,
            }));
        } catch {
            setState((prev) => ({
                ...prev,
                firebaseUser,
                user: null,
                loading: false,
                error: 'Failed to fetch user profile',
            }));
        }
    }, []);

    // Listen to auth state changes
    useEffect(() => {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await fetchUserProfile(firebaseUser);
            } else {
                setState({
                    firebaseUser: null,
                    user: null,
                    loading: false,
                    error: null,
                });
            }
        });

        return () => unsubscribe();
    }, [fetchUserProfile]);

    // Sign in with email/password
    const signIn = async (email: string, password: string): Promise<ApiResponse<User>> => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            const auth = getFirebaseAuth();
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const user = await getUserById(credential.user.uid);

            if (!user) {
                await firebaseSignOut(auth);
                return { success: false, error: 'User profile not found' };
            }

            setState((prev) => ({
                ...prev,
                firebaseUser: credential.user,
                user,
                loading: false,
            }));

            return { success: true, data: user };
        } catch (error: unknown) {
            const errorMessage = getFirebaseErrorMessage((error as FirebaseError).code);
            setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
            return { success: false, error: errorMessage };
        }
    };

    // Sign up with email/password
    const signUp = async (data: UserRegistration): Promise<ApiResponse<User>> => {
        try {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            const auth = getFirebaseAuth();

            // Create Firebase Auth user
            const credential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            // Create user profile in Firestore
            const result = await createUserProfile(credential.user.uid, data);

            if (!result.success) {
                // Cleanup: delete Firebase user if profile creation fails
                await credential.user.delete();
                return result;
            }

            setState((prev) => ({
                ...prev,
                firebaseUser: credential.user,
                user: result.data!,
                loading: false,
            }));

            return result;
        } catch (error: unknown) {
            const errorMessage = getFirebaseErrorMessage((error as FirebaseError).code);
            setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
            return { success: false, error: errorMessage };
        }
    };

    // Sign out
    const signOut = async (): Promise<void> => {
        try {
            const auth = getFirebaseAuth();
            await firebaseSignOut(auth);
            setState({
                firebaseUser: null,
                user: null,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Reset password
    const resetPassword = async (email: string): Promise<ApiResponse<void>> => {
        try {
            const auth = getFirebaseAuth();
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error: unknown) {
            return { success: false, error: getFirebaseErrorMessage((error as FirebaseError).code) };
        }
    };

    // Change password
    const changePassword = async (newPassword: string): Promise<ApiResponse<void>> => {
        try {
            if (!state.firebaseUser) {
                return { success: false, error: 'Not authenticated' };
            }
            await updatePassword(state.firebaseUser, newPassword);
            return { success: true };
        } catch (error: unknown) {
            return { success: false, error: getFirebaseErrorMessage((error as FirebaseError).code) };
        }
    };

    // Refresh user profile
    const refreshUser = async (): Promise<void> => {
        if (state.firebaseUser) {
            await fetchUserProfile(state.firebaseUser);
        }
    };

    const value: AuthContextValue = {
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        changePassword,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOKS
// ============================================

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function useUser(): User | null {
    const { user } = useAuth();
    return user;
}

export function useIsAuthenticated(): boolean {
    const { user, loading } = useAuth();
    return !loading && user !== null;
}

export function useIsApproved(): boolean {
    const { user, loading } = useAuth();
    return !loading && user !== null && user.status === 'approved';
}

export function useIsAdmin(): boolean {
    const { user, loading } = useAuth();
    return !loading && user !== null && user.role === 'admin';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getFirebaseErrorMessage(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please log in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/requires-recent-login':
            return 'Please log in again to perform this action.';
        default:
            return 'An error occurred. Please try again.';
    }
}
