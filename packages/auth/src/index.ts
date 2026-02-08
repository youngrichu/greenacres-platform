// Auth Provider and Hooks
export {
    AuthProvider,
    useAuth,
    useUser,
    useIsAuthenticated,
    useIsApproved,
    useIsAdmin,
} from './provider';

// Re-export types
export type { User, UserRole, UserStatus, UserRegistration } from '@greenacres/types';
