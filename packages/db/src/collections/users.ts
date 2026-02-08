import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
} from 'firebase/firestore';
import { getDb, COLLECTIONS } from '../firebase';
import type { User, UserRole, UserStatus, UserRegistration, ApiResponse } from '@greenacres/types';
import { notifyAdminRegistration, notifyBuyerRegistrationReceived, notifyUserStatusUpdate } from './mail';

// Convert Firestore document to User type
function docToUser(id: string, data: DocumentData): User {
    return {
        id,
        email: data.email,
        role: data.role,
        status: data.status,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phone: data.phone,
        country: data.country,
        companyType: data.companyType,
        createdAt: data.createdAt?.toDate() || new Date(),
        approvedAt: data.approvedAt?.toDate(),
        approvedBy: data.approvedBy,
    };
}

// Get all users
export async function getUsers(): Promise<User[]> {
    const db = getDb();
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => docToUser(doc.id, doc.data()));
}

// Get users by status
export async function getUsersByStatus(status: UserStatus): Promise<User[]> {
    const db = getDb();
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(
        usersRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => docToUser(doc.id, doc.data()));
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
    const db = getDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) return null;
    return docToUser(snapshot.id, snapshot.data());
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
    const db = getDb();
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return docToUser(doc.id, doc.data());
}

// Create user profile (called after Firebase Auth registration)
export async function createUserProfile(
    userId: string,
    data: UserRegistration
): Promise<ApiResponse<User>> {
    try {
        const db = getDb();
        const userRef = doc(db, COLLECTIONS.USERS, userId);

        const userData = {
            email: data.email,
            role: 'buyer' as const,
            status: 'pending' as const,
            companyName: data.companyName,
            contactPerson: data.contactPerson,
            phone: data.phone,
            country: data.country,
            companyType: data.companyType,
            createdAt: Timestamp.now(),
        };

        await setDoc(userRef, userData);

        // Notify admin and buyer
        await notifyAdminRegistration({ ...userData, id: userId, createdAt: new Date() });
        await notifyBuyerRegistrationReceived(userData.email, userData.companyName);

        return {
            success: true,
            data: {
                id: userId,
                ...userData,
                createdAt: new Date(),
            },
        };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create user profile',
        };
    }
}

// Update user status (approve/reject)
export async function updateUserStatus(
    userId: string,
    status: UserStatus,
    adminId?: string
): Promise<ApiResponse<User>> {
    try {
        const db = getDb();
        const userRef = doc(db, COLLECTIONS.USERS, userId);

        const updateData: Record<string, unknown> = {
            status,
        };

        if (status === 'approved' && adminId) {
            updateData.approvedAt = Timestamp.now();
            updateData.approvedBy = adminId;
        }

        await updateDoc(userRef, updateData);

        const updatedUser = await getUserById(userId);
        if (!updatedUser) {
            return { success: false, error: 'User not found after update' };
        }

        // Notify buyer of status change
        await notifyUserStatusUpdate(updatedUser);

        return { success: true, data: updatedUser };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user status',
        };
    }
}

// Update user profile
export async function updateUserProfile(
    userId: string,
    data: Partial<User>
): Promise<ApiResponse<User>> {
    try {
        const db = getDb();
        const userRef = doc(db, COLLECTIONS.USERS, userId);

        // Remove fields that shouldn't be updated directly
        const updateData = { ...data };
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.approvedAt;
        delete updateData.approvedBy;
        delete updateData.role;
        delete updateData.status;

        await updateDoc(userRef, updateData);

        const updatedUser = await getUserById(userId);
        if (!updatedUser) {
            return { success: false, error: 'User not found after update' };
        }

        return { success: true, data: updatedUser };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user profile',
        };
    }
}

// Update user role (admin only)
export async function updateUserRole(
    userId: string,
    role: UserRole
): Promise<ApiResponse<User>> {
    try {
        const db = getDb();
        const userRef = doc(db, COLLECTIONS.USERS, userId);

        await updateDoc(userRef, { role });

        const updatedUser = await getUserById(userId);
        if (!updatedUser) {
            return { success: false, error: 'User not found after update' };
        }

        return { success: true, data: updatedUser };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user role',
        };
    }
}

// Get user counts by status
export async function getUserCounts(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}> {
    const users = await getUsers();

    return {
        total: users.length,
        pending: users.filter((u) => u.status === 'pending').length,
        approved: users.filter((u) => u.status === 'approved').length,
        rejected: users.filter((u) => u.status === 'rejected').length,
    };
}
