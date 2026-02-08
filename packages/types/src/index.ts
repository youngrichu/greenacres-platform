// ============================================
// USER TYPES
// ============================================

export type UserRole = 'buyer' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type CompanyType = 'roaster' | 'importer' | 'trader' | 'other';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    companyName: string;
    contactPerson: string;
    phone: string;
    country: string;
    companyType: CompanyType;
    createdAt: Date;
    approvedAt?: Date;
    approvedBy?: string;
}

export interface UserRegistration {
    email: string;
    password: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    country: string;
    companyType: CompanyType;
}

// ============================================
// COFFEE PRODUCT TYPES
// ============================================

export type Preparation = 'washed' | 'natural';
export type Availability = 'in_stock' | 'pre_shipment' | 'out_of_stock';
export type Location = string;

export interface LocationConfig {
    id: string;
    name: string;
    flag: string;
    terms: string;
    displayOrder: number;
}

export const DefaultLocations: LocationConfig[] = [
    { id: 'addis_ababa', name: 'Addis Ababa', flag: '🇪🇹', terms: 'FOB Djibouti', displayOrder: 1 },
    { id: 'trieste', name: 'Trieste', flag: '🇮🇹', terms: 'EXW', displayOrder: 2 },
    { id: 'genoa', name: 'Genoa', flag: '🇮🇹', terms: 'EXW', displayOrder: 3 },
];

export const LocationLabels: Record<string, string> = {
    addis_ababa: 'Addis Ababa, Ethiopia',
    trieste: 'Port Trieste, Italy',
    genoa: 'Port Genoa, Italy',
};

export const LocationTerms: Record<string, string> = {
    addis_ababa: 'FOB Djibouti',
    trieste: 'EXW',
    genoa: 'EXW',
};

export interface CoffeePricing {
    location: Location;
    pricePerLb: number;
    availability: Availability;
    availabilityPeriod: string;
    terms: string;
    paymentTerms: string;
    updatedAt: Date;
    updatedBy?: string;
}

export interface CoffeeProduct {
    id: string;
    name: string;
    station: string;
    region: string;
    grade: string;
    preparation: Preparation;
    cropYear: string;
    certification: string;
    scaScore: string;
    tastingNotes: string[];
    bagSize: string;
    referenceCode: string;
    isTopLot: boolean;
    imageUrl?: string;
    images?: string[];
    videos?: string[];
    isActive: boolean;
    displayOrder: number;
    pricing: Record<Location, CoffeePricing>;
    createdAt: Date;
    updatedAt: Date;
}

// Coffee regions for filtering
export const CoffeeRegions = [
    'Yirgacheffe',
    'Sidamo',
    'Guji',
    'Limmu',
    'Nekempti',
    'Djimmah',
    'Jimma',
] as const;

export type CoffeeRegion = (typeof CoffeeRegions)[number];

// Coffee grades
export const CoffeeGrades = ['G1', 'G2', 'G3', 'G4', 'G5'] as const;
export type CoffeeGrade = (typeof CoffeeGrades)[number];

// Flavor categories for filtering
export const FlavorCategories = {
    Chocolate: ['Milk chocolate', 'dark chocolate', 'cocoa'],
    Caramel: ['Caramel', 'brown sugar', 'toffee'],
    Berry: ['Blueberry', 'strawberry', 'raspberry', 'blackcurrant', 'red grape'],
    Floral: ['Jasmine', 'iris', 'rose', 'bergamot'],
    Citrus: ['Lemon', 'orange', 'lime', 'grapefruit'],
    'Stone Fruit': ['Apricot', 'peach', 'nectarine', 'plum'],
    Sweet: ['Honey', 'sugar', 'molasses'],
    Nutty: ['Roasted nuts', 'almond'],
    Spice: ['Cinnamon', 'clove', 'black tea'],
    Tropical: ['Tropical fruit', 'pineapple', 'mango'],
    Winey: ['Wine', 'red wine', 'winey'],
} as const;

export type FlavorCategory = keyof typeof FlavorCategories;

// ============================================
// INQUIRY TYPES
// ============================================

export type InquiryStatus = 'new' | 'reviewed' | 'completed' | 'cancelled';

export interface InquiryItem {
    coffeeId: string;
    coffeeName: string;
    quantity: number;
    preferredLocation: Location;
}

export interface Inquiry {
    id: string;
    userId: string;
    userEmail: string;
    companyName: string;
    coffeeItems: InquiryItem[];
    targetShipmentDate?: Date;
    message?: string;
    status: InquiryStatus;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InquirySubmission {
    coffeeItems: InquiryItem[];
    targetShipmentDate?: Date;
    message?: string;
}

// ============================================
// FILTER TYPES
// ============================================

export interface CatalogFilters {
    regions: CoffeeRegion[];
    grades: CoffeeGrade[];
    preparations: Preparation[];
    certifications: string[];
    flavors: FlavorCategory[];
    availability: Availability[];
    locations: Location[];
}

export type SortOption =
    | 'position'
    | 'name_asc'
    | 'name_desc'
    | 'price_asc'
    | 'price_desc'
    | 'grade'
    | 'sca_score';

export type ViewMode = 'grid' | 'list';

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================
// STATISTICS TYPES
// ============================================

export interface DashboardStats {
    totalBuyers: number;
    pendingBuyers: number;
    approvedBuyers: number;
    newInquiries: number;
    totalCoffees: number;
    activeCoffees: number;
}
