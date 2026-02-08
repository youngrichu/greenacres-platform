import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

function initializeFirebase() {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }

    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    return { app, db, auth, storage };
}

// Export initialized instances
export function getFirebaseApp(): FirebaseApp {
    if (!app) initializeFirebase();
    return app;
}

export function getDb(): Firestore {
    if (!db) initializeFirebase();
    return db;
}

export function getFirebaseAuth(): Auth {
    if (!auth) initializeFirebase();
    return auth;
}

export function getFirebaseStorage(): FirebaseStorage {
    if (!storage) initializeFirebase();
    return storage;
}

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    COFFEES: 'coffees',
    INQUIRIES: 'inquiries',
    MAIL: 'mail',
} as const;
