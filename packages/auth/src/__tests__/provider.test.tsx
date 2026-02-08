import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../provider';
import React from 'react';

// Mock Firebase
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(() => vi.fn()),
}));

// Mock DB
vi.mock('@greenacres/db', () => ({
    getFirebaseAuth: vi.fn(),
    getUserById: vi.fn(),
}));

describe('AuthProvider', () => {
    it('renders children', () => {
        render(
            <AuthProvider>
                <div data-testid="child">Child Content</div>
            </AuthProvider>
        );

        expect(screen.getByTestId('child')).toBeDefined();
    });
});
