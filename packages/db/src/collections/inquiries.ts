import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
} from 'firebase/firestore';
import { getDb, COLLECTIONS } from '../firebase';
import type {
    Inquiry,
    InquiryStatus,
    InquirySubmission,
    ApiResponse,
    User,
} from '@greenacres/types';
import { notifyAdminInquiry, notifyBuyerInquiryConfirmation } from './mail';

// Convert Firestore document to Inquiry type
function docToInquiry(id: string, data: DocumentData): Inquiry {
    return {
        id,
        userId: data.userId,
        userEmail: data.userEmail,
        companyName: data.companyName,
        coffeeItems: data.coffeeItems || [],
        targetShipmentDate: data.targetShipmentDate?.toDate(),
        message: data.message,
        status: data.status || 'new',
        adminNotes: data.adminNotes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
}

// Get all inquiries
export async function getInquiries(): Promise<Inquiry[]> {
    const db = getDb();
    const inquiriesRef = collection(db, COLLECTIONS.INQUIRIES);
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => docToInquiry(doc.id, doc.data()));
}

// Get inquiries by status
export async function getInquiriesByStatus(status: InquiryStatus): Promise<Inquiry[]> {
    const db = getDb();
    const inquiriesRef = collection(db, COLLECTIONS.INQUIRIES);
    const q = query(
        inquiriesRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => docToInquiry(doc.id, doc.data()));
}

// Get inquiries by user
export async function getInquiriesByUser(userId: string): Promise<Inquiry[]> {
    const db = getDb();
    const inquiriesRef = collection(db, COLLECTIONS.INQUIRIES);
    const q = query(
        inquiriesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => docToInquiry(doc.id, doc.data()));
}

// Get inquiry by ID
export async function getInquiryById(inquiryId: string): Promise<Inquiry | null> {
    const db = getDb();
    const inquiryRef = doc(db, COLLECTIONS.INQUIRIES, inquiryId);
    const snapshot = await getDoc(inquiryRef);

    if (!snapshot.exists()) return null;
    return docToInquiry(snapshot.id, snapshot.data());
}

// Create new inquiry
export async function createInquiry(
    user: User,
    data: InquirySubmission
): Promise<ApiResponse<Inquiry>> {
    try {
        const db = getDb();
        const inquiriesRef = collection(db, COLLECTIONS.INQUIRIES);

        const inquiryData = {
            userId: user.id,
            userEmail: user.email,
            companyName: user.companyName,
            coffeeItems: data.coffeeItems,
            targetShipmentDate: data.targetShipmentDate
                ? Timestamp.fromDate(new Date(data.targetShipmentDate))
                : null,
            message: data.message || null,
            status: 'new' as const,
            adminNotes: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(inquiriesRef, inquiryData);

        // Notify admin and buyer
        await notifyAdminInquiry(user, data);
        await notifyBuyerInquiryConfirmation(user, data);

        return {
            success: true,
            data: {
                id: docRef.id,
                userId: user.id,
                userEmail: user.email,
                companyName: user.companyName,
                coffeeItems: data.coffeeItems,
                targetShipmentDate: data.targetShipmentDate,
                message: data.message,
                status: 'new',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create inquiry',
        };
    }
}

// Update inquiry status
export async function updateInquiryStatus(
    inquiryId: string,
    status: InquiryStatus,
    adminNotes?: string
): Promise<ApiResponse<Inquiry>> {
    try {
        const db = getDb();
        const inquiryRef = doc(db, COLLECTIONS.INQUIRIES, inquiryId);

        const updateData: Record<string, unknown> = {
            status,
            updatedAt: Timestamp.now(),
        };

        if (adminNotes !== undefined) {
            updateData.adminNotes = adminNotes;
        }

        await updateDoc(inquiryRef, updateData);

        const updatedInquiry = await getInquiryById(inquiryId);
        if (!updatedInquiry) {
            return { success: false, error: 'Inquiry not found after update' };
        }

        return { success: true, data: updatedInquiry };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update inquiry',
        };
    }
}

// Add admin notes to inquiry
export async function addInquiryNotes(
    inquiryId: string,
    notes: string
): Promise<ApiResponse<Inquiry>> {
    try {
        const db = getDb();
        const inquiryRef = doc(db, COLLECTIONS.INQUIRIES, inquiryId);

        await updateDoc(inquiryRef, {
            adminNotes: notes,
            updatedAt: Timestamp.now(),
        });

        const updatedInquiry = await getInquiryById(inquiryId);
        if (!updatedInquiry) {
            return { success: false, error: 'Inquiry not found after update' };
        }

        return { success: true, data: updatedInquiry };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add notes',
        };
    }
}

// Get inquiry counts
export async function getInquiryCounts(): Promise<{
    total: number;
    new: number;
    reviewed: number;
    completed: number;
}> {
    const inquiries = await getInquiries();

    return {
        total: inquiries.length,
        new: inquiries.filter((i) => i.status === 'new').length,
        reviewed: inquiries.filter((i) => i.status === 'reviewed').length,
        completed: inquiries.filter((i) => i.status === 'completed').length,
    };
}

// Get new inquiries count (for dashboard)
export async function getNewInquiriesCount(): Promise<number> {
    const newInquiries = await getInquiriesByStatus('new');
    return newInquiries.length;
}
