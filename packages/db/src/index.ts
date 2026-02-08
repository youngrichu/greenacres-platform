// Firebase initialization
export { getDb, getFirebaseAuth, getFirebaseStorage, COLLECTIONS } from './firebase';

// User operations
export {
    getUsers,
    getUsersByStatus,
    getUserById,
    getUserByEmail,
    createUserProfile,
    updateUserStatus,
    updateUserProfile,
    updateUserRole,
    getUserCounts,
} from './collections/users';

// Coffee operations
export {
    getCoffees,
    getCoffeeById,
    filterCoffees,
    createCoffee,
    updateCoffee,
    updateCoffeePricing,
    toggleCoffeeActive,
    updateCoffeeOrder,
    getCoffeeCount,
    deleteCoffee,
} from './collections/coffees';

// Inquiry operations
export {
    getInquiries,
    getInquiriesByStatus,
    getInquiriesByUser,
    getInquiryById,
    createInquiry,
    updateInquiryStatus,
    addInquiryNotes,
    getInquiryCounts,
    getNewInquiriesCount,
} from './collections/inquiries';

// Mail operations
export {
    sendEmail,
    notifyAdminRegistration,
    notifyBuyerRegistrationReceived,
    notifyUserStatusUpdate,
    notifyAdminInquiry,
    notifyBuyerInquiryConfirmation,
} from './collections/mail';

// Email Templates
export { createFormattedEmail } from './templates/email-theme';

// Settings operations
export {
    getPricingLocations,
    savePricingLocations,
} from './collections/settings';

// Re-export types for convenience
export type {
    User,
    UserRole,
    UserStatus,
    UserRegistration,
    CoffeeProduct,
    CoffeePricing,
    Location,
    Preparation,
    Availability,
    Inquiry,
    InquiryItem,
    InquiryStatus,
    InquirySubmission,
    CatalogFilters,
    SortOption,
    ApiResponse,
    DashboardStats,
} from '@greenacres/types';
