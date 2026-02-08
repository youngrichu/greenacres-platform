# Product Requirements Document (PRD)

## Greenacres Coffee Trading Platform

------

### Document Information

| Field         | Details                                             |
| ------------- | --------------------------------------------------- |
| Project       | Greenacres Coffee Trading Platform                  |
| Client        | Greenacres Industrial PLC                           |
| Contact       | Sisay Abebe Mulugeta (CEO)                          |
| Email         | sisay@greenacrescoffee.com                          |
| Inquiry Email | ethiocof@greenacrescoffee.com                       |
| Phone         | +251-935401179                                      |
| Developer     | Zaraytech Information Technology Co. L.L.C.         |
| Budget        | $3,250 USD                                          |
| Start Date    | January 2026                                        |
| Current State | Demo live at https://greenacres-coffee.netlify.app/ |
| Repository    | https://github.com/youngrichu/greenacres-web.git    |

------

## 1. Project Overview

### 1.1 Background

Greenacres Industrial PLC is a licensed Ethiopian coffee exporter based in Addis Ababa, specializing in premium Arabica green coffee beans. They export 10,560+ tons yearly to buyers across Europe, the Middle East, Asia, and North America.

### 1.2 Objective

Transform the existing showcase website into a trading platform where registered buyers can view live pricing and stock availability, while providing the client with an admin dashboard to manage daily updates.

### 1.3 Design Inspiration

Client has expressed strong preference for Covoya Coffee's interface (covoyacoffee.com), specifically:

- Product card layout with origin map thumbnails
- Flavor-based filtering system
- Clean stock/location display
- Reference code visibility
- "Log In To Buy / Sample" call-to-action

Note: Covoya is a full e-commerce platform. Greenacres will be a showcase/inquiry platform where orders are handled offline. We take design elements, not e-commerce functionality.

### 1.4 Current Website Features (Already Built)

- Responsive design (mobile, tablet, desktop)
- Interactive Ethiopia coffee regions map
- Coffee collection showcase with flavor profiles and hover effects
- Golden gradient accent for Grade 1 premium coffees
- Scroll-triggered animations
- Statistics section (placeholder values)
- "From Seed to Cup" journey section
- Contact form
- Next.js framework, hosted on Netlify

------

## 2. User Roles

### 2.1 Public Visitor

- Can view public pages (Home, About, Regions, Contact)
- Can see coffee collection overview (without pricing)
- Can register for a buyer account
- Cannot see live pricing or stock levels

### 2.2 Registered Buyer (Approved)

- Full access to coffee catalog with live pricing
- View stock availability across all locations
- View FOB Djibouti and EXW European port pricing
- Submit order inquiries
- Manage their profile

### 2.3 Registered Buyer (Pending)

- Account created but awaiting admin approval
- Cannot access pricing or stock information
- Sees "pending approval" status message

### 2.4 Admin (Sisay)

- Update daily coffee prices
- Manage stock levels and availability per location
- Approve or reject buyer registrations
- View and manage buyer inquiries
- Manage coffee product listings

------

## 3. Functional Requirements

### 3.1 Authentication System

#### 3.1.1 Buyer Registration

**Registration Form Fields:**

| Field          | Type     | Required |
| -------------- | -------- | -------- |
| Company Name   | Text     | Yes      |
| Contact Person | Text     | Yes      |
| Email          | Email    | Yes      |
| Password       | Password | Yes      |
| Phone/WhatsApp | Text     | Yes      |
| Country        | Dropdown | Yes      |
| Company Type   | Dropdown | Yes      |

**Company Type Options:**

- Roaster
- Importer
- Trader
- Other

**Registration Flow:**

1. Buyer fills registration form
2. System creates account with "pending" status
3. Admin receives notification (email)
4. Admin reviews and approves/rejects
5. Buyer receives email notification of approval/rejection
6. Approved buyers can log in and view pricing

#### 3.1.2 Login

- Email and password authentication
- "Forgot password" functionality
- Session management
- Redirect to buyer dashboard after login

#### 3.1.3 Logout

- Clear session
- Redirect to homepage

### 3.2 Buyer Portal

#### 3.2.1 Buyer Dashboard

- Welcome message with company name
- Quick stats (new offers, inquiries submitted)
- Navigation to coffee catalog

#### 3.2.2 Coffee Catalog (Authenticated View)

**Product Card Design (Covoya-Inspired)**

Each coffee card displays:

| Element              | Example                                       | Notes                                     |
| -------------------- | --------------------------------------------- | ----------------------------------------- |
| Product Title        | ETHIOPIA YIRGACHEFFE G1 GEDEB - WASHED (2024) | Region + Grade + Station + Process + Year |
| Origin Map Thumbnail | Ethiopia silhouette with region highlighted   | Visual identifier                         |
| TOP LOT Badge        | Green badge                                   | For Grade 1 / SCA 87+ coffees             |
| Tasting Notes        | Lemon, jasmine, black tea, honey              | Flavor wheel style                        |
| Reference Code       | ET-YG-W1-24                                   | Internal tracking                         |
| Certification        | Organic RFA / Conventional                    | Badge or text                             |
| SCA Score            | 87+                                           | Quality indicator                         |
| Location & Stock     | Addis Ababa: In Stock (1280 bags)             | Per-location availability                 |
| Price                | $4.85/lb                                      | Visible only to logged-in buyers          |
| Action Button        | "Log In To Buy / Sample" or "Inquire"         | Primary CTA                               |

**Filter Sidebar (Covoya-Inspired)**

| Filter             | Options                                                      |
| ------------------ | ------------------------------------------------------------ |
| Origin/Region      | Yirgacheffe, Sidama, Guji, Limmu, Nekempti, Djimmah          |
| Grade              | G1, G2, G3, G4, G5                                           |
| Processing         | Washed, Natural                                              |
| Certification      | Organic RFA, Conventional                                    |
| Flavor Wheel       | Chocolate, Caramel, Berry, Floral, Citrus, Stone Fruit, Spice, Sweet, Nutty |
| Availability       | In Stock, Pre-Shipment                                       |
| Warehouse/Location | Addis Ababa, Port Trieste, Port Genoa                        |

**Flavor Filtering Feature:** When a user clicks on a flavor tag (e.g., "Berry"), the catalog filters to show only coffees with that flavor note. This was specifically requested by the client.

**View Options:**

- Grid view (default, card layout)
- List view (table layout)
- Sort by: Position, Name, Price, Grade, SCA Score

**Pricing Display (per location):**

| Location              | Price/lb | Availability | Terms        |
| --------------------- | -------- | ------------ | ------------ |
| Addis Ababa, Ethiopia | $4.85    | In Stock     | FOB Djibouti |
| Port Trieste, Italy   | $5.20    | In Stock     | EXW          |
| Port Genoa, Italy     | $5.20    | Pre-Shipment | EXW          |

#### 3.2.3 Inquiry Form

**Fields:**

| Field                | Type         | Required |
| -------------------- | ------------ | -------- |
| Coffee Selection     | Multi-select | Yes      |
| Quantity (bags)      | Number       | Yes      |
| Preferred Location   | Dropdown     | Yes      |
| Target Shipment Date | Date         | No       |
| Message              | Textarea     | No       |

**Flow:**

1. Buyer selects coffees and fills form
2. Inquiry saved to database
3. Email sent to ethiocof@greenacrescoffee.com
4. Buyer sees confirmation message
5. Order handled offline by Sisay

#### 3.2.4 Buyer Profile

- View/edit company information
- Change password
- View inquiry history

### 3.3 Admin Dashboard

#### 3.3.1 Admin Login

- Separate admin login page (/admin)
- Secure authentication
- Only accessible by admin credentials

#### 3.3.2 Dashboard Overview

- Total registered buyers (approved/pending)
- New inquiries count
- Quick actions (approve users, update prices)

#### 3.3.3 Price Management

**Interface:**

- Table view of all coffee products
- Inline editing for prices per location
- Bulk update option
- Last updated timestamp

**Editable Fields per Product:**

| Field                       | Editable |
| --------------------------- | -------- |
| Price/lb (Addis Ababa)      | Yes      |
| Price/lb (Trieste)          | Yes      |
| Price/lb (Genoa)            | Yes      |
| Availability (per location) | Yes      |
| Active/Inactive             | Yes      |

#### 3.3.4 User Management

**Buyer List View:**

- Company name
- Contact person
- Email
- Country
- Company type
- Registration date
- Status (Approved/Pending/Rejected)
- Actions (Approve/Reject/View)

**Approval Flow:**

1. View pending registrations
2. Click to see full details
3. Approve or Reject with optional note
4. System sends email to buyer

#### 3.3.5 Inquiry Management

**Inquiry List View:**

- Date submitted
- Company name
- Coffees requested
- Quantity
- Status (New/Reviewed/Completed)
- Actions (View/Mark as Reviewed)

**Inquiry Detail View:**

- Full inquiry details
- Buyer contact information
- Option to mark status
- Notes field for internal use

#### 3.3.6 Product Management

- Add new coffee products
- Edit existing products
- Deactivate products (hide from catalog)
- Reorder display sequence

### 3.4 Public Website Updates

#### 3.4.1 Content Updates (From Client)

| Item          | Current                   | Update To                     |
| ------------- | ------------------------- | ----------------------------- |
| Contact Email | info@greenacrescoffee.com | ethiocof@greenacrescoffee.com |
| Export Volume | Placeholder               | 10,560+ tons yearly           |

#### 3.4.2 Statistics Section

| Stat                 | Value   | Source               |
| -------------------- | ------- | -------------------- |
| Washing Stations     | 3       | Client confirmed     |
| Drying Stations      | 3       | Client confirmed     |
| Tons Exported Yearly | 10,560+ | Client confirmed     |
| Partner Farmers      | TBD     | Awaiting from client |
| Export Destinations  | TBD     | Awaiting from client |

#### 3.4.3 Station Information (Client Provided)

**Washing Stations (Washed Coffee):**

| Region | Station               | Location                           |
| ------ | --------------------- | ---------------------------------- |
| Sidamo | Nensebo               | West Arsi                          |
| Guji   | Guduba Station        | Gotae Sodu Kebele, Hambella Woreda |
| Guji   | Sisay Washing Station | Haro Sorsa Kebele, Hambella Woreda |

**Drying Stations (Natural Coffee):**

| Region      | Station              | Location                                      |
| ----------- | -------------------- | --------------------------------------------- |
| Yirgacheffe | Banko Gotiti Station | Bako Gotiti Kebele, Gedeb Woreda, SNNP Region |
| Yirgacheffe | Wurae Station        | Halo Berti Kebele, Gedeb Woreda               |
| Jimma       | Agaro Drying Station | Jimma Zone                                    |

#### 3.4.4 About Us Section

- Company overview
- Vision and mission
- Team profiles (photos pending from client)
- Station information with photos

#### 3.4.5 Media Content (Recommendation)

**Client Question:** "Should we add videos and pictures next to each coffee offering, or include them in a separate gallery?"

**Our Recommendation:** Include images directly alongside each coffee listing. When a buyer is looking at Yirgacheffe G1 from Banko Gotiti, seeing the station or processing photos right there creates an immediate connection. It tells a story without requiring them to navigate elsewhere.

If the client provides enough quality content, we can also add a separate gallery page as a secondary feature for deeper exploration.

**Media Placement:**

- Product cards: Station/processing thumbnail image
- Coffee detail page: Multiple images (station, drying beds, cherry sorting)
- Gallery page (optional): Full collection of photos and videos

#### 3.4.6 Navigation Updates

| Menu Item        | Status                        |
| ---------------- | ----------------------------- |
| Home             | Existing                      |
| About            | Existing (needs content)      |
| Regions          | Existing                      |
| Our Coffee       | Update to show public preview |
| How to Order     | Add new page                  |
| Contact          | Update email to ethiocof@     |
| Login / Register | Add to header                 |
| Buyer Portal     | Show when logged in           |

### 3.5 Social Media Integration

#### 3.5.1 Current Status

Client confirmed: "I only have a LinkedIn account, and the profile is not well articulated. I do not have any other social media presence."

#### 3.5.2 Accounts to Create/Update

| Platform  | Current Status             | Action                                                 |
| --------- | -------------------------- | ------------------------------------------------------ |
| LinkedIn  | Exists (needs improvement) | Clean up profile, update branding, company description |
| Facebook  | Does not exist             | Create business page from scratch                      |
| Instagram | Does not exist             | Create business account from scratch                   |
| TikTok    | Does not exist             | Create account from scratch                            |

#### 3.5.3 Branding Requirements

For each platform:

- Profile picture: Company logo (need high-res from client)
- Cover/banner image: Coffee imagery with branding
- Bio/description: Consistent messaging about Ethiopian coffee export
- Contact information: ethiocof@greenacrescoffee.com, +251-935401179
- Website link: greenacrescoffee.com

#### 3.5.4 Website Integration

- Social media icons in header and footer
- Links to all profiles (open in new tab)
- Consistent icon styling matching site design

### 3.6 Google Business Profile

- Create Google Business Profile
- Add office location: Akaki Kality Subcity Woreda 07, Delta Complex Building, 5th Floor, Addis Ababa, Ethiopia
- Add business hours, contact info, photos
- Embed Google Map on Contact page

------

## 4. Data Models

### 4.1 Users Table

```
users
├── id (UUID, primary key)
├── email (string, unique)
├── password_hash (string)
├── role (enum: buyer, admin)
├── status (enum: pending, approved, rejected)
├── company_name (string)
├── contact_person (string)
├── phone (string)
├── country (string)
├── company_type (string)
├── created_at (timestamp)
├── approved_at (timestamp, nullable)
└── approved_by (UUID, nullable, foreign key)
```

### 4.2 Coffee Products Table

```
coffee_products
├── id (UUID, primary key)
├── name (string) -- e.g., "Yirgacheffe G1"
├── station (string) -- e.g., "Banko Gotiti"
├── region (string) -- e.g., "Yirgacheffe"
├── grade (string) -- e.g., "G1"
├── preparation (enum: washed, natural)
├── crop_year (string) -- e.g., "25/26"
├── certification (string) -- e.g., "Organic RFA"
├── sca_score (string) -- e.g., "87+"
├── tasting_notes (array of strings)
├── bag_size (string) -- e.g., "60 KG GrainPro"
├── reference_code (string) -- e.g., "ET-YG-W1-24"
├── is_top_lot (boolean) -- for TOP LOT badge
├── image_url (string, nullable) -- station/product photo
├── is_active (boolean)
├── display_order (integer)
├── created_at (timestamp)
└── updated_at (timestamp)
```

**Reference Code Format:** Format: `ET-{REGION}-{PROCESS}{GRADE}-{YEAR}`

Examples:

| Coffee                              | Reference Code |
| ----------------------------------- | -------------- |
| Ethiopia Yirgacheffe G1 Washed 2024 | ET-YG-W1-24    |
| Ethiopia Guji G4 Natural 2024       | ET-GJ-N4-24    |
| Ethiopia Sidamo G2 Washed 2024      | ET-SD-W2-24    |
| Ethiopia Jimma G5 Natural 2024      | ET-JM-N5-24    |
| Ethiopia Limmu G2 Washed 2024       | ET-LM-W2-24    |
| Ethiopia Nekempti G4 Natural 2024   | ET-NK-N4-24    |
| Ethiopia Djimmah G5 Natural 2024    | ET-DJ-N5-24    |

### 4.3 Pricing Table

```
coffee_pricing
├── id (UUID, primary key)
├── coffee_id (UUID, foreign key)
├── location (enum: addis_ababa, trieste, genoa)
├── price_per_lb (decimal)
├── availability (enum: in_stock, pre_shipment, out_of_stock)
├── availability_period (string) -- e.g., "Jan/Feb 2026"
├── terms (string) -- e.g., "FOB" or "EXW"
├── payment_terms (string) -- e.g., "LC/CAD"
├── updated_at (timestamp)
└── updated_by (UUID, foreign key)
```

### 4.4 Inquiries Table

```
inquiries
├── id (UUID, primary key)
├── user_id (UUID, foreign key)
├── coffee_items (JSON array)
│   ├── coffee_id
│   ├── quantity
│   └── preferred_location
├── target_shipment_date (date, nullable)
├── message (text, nullable)
├── status (enum: new, reviewed, completed)
├── admin_notes (text, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

------

## 5. Coffee Product Data

### 5.1 Coffee Specifications (from Client)

**Washed Coffee:** Grade 1 and Grade 2 (any brand) **Natural Coffee:** Grade 1 up to Grade 5

### 5.2 Initial Product List (from Offer List dated 08/Jan/2025)

| #    | Quality        | Station       | Prep    | Cert         | Price/lb | SCA  | Availability     |
| ---- | -------------- | ------------- | ------- | ------------ | -------- | ---- | ---------------- |
| 1    | Yirgacheffe G1 | Banko Gotiti  | Natural | Organic RFA  | $4.85    | 87+  | March/April 2026 |
| 2    | Sidamo G1      | Nensebo       | Natural | Organic RFA  | $4.85    | 87+  | March/April 2026 |
| 3    | Guji G1        | Buliyae       | Natural | Organic RFA  | $4.85    | 87+  | March/April 2026 |
| 4    | Guji G1        | Michicha      | Natural | Organic RFA  | $4.85    | 87+  | March/April 2026 |
| 5    | Guji G1        | Alaka         | Natural | Organic RFA  | $4.85    | 87+  | March/April 2026 |
| 6    | Yirgacheffe G1 | Gedeb         | Natural | Organic RFA  | $4.85    | 87+  | March/April 2026 |
| 7    | Yirgacheffe G1 | Gedeb         | Washed  | Organic RFA  | $4.85    | 87+  | Jan/Feb 2026     |
| 8    | Guji G1        | Gotae Sodu    | Washed  | Organic RFA  | $4.85    | 87+  | Jan/Feb 2026     |
| 9    | Sidamo G1      | Nensebo       | Washed  | Organic RFA  | $4.85    | 87+  | Jan/Feb 2026     |
| 10   | Yirgacheffe G2 | Gedeb         | Washed  | Organic RFA  | $3.90    | 84+  | Jan/Feb 2026     |
| 11   | Sidamo G2      | Bensa         | Washed  | Organic RFA  | $3.90    | 84+  | Jan/Feb 2026     |
| 12   | Limmu G2       | Gera          | Washed  | Conventional | $3.80    | 84   | Jan/Feb 2026     |
| 13   | Sidamo G3      | Bensa         | Natural | Conventional | $3.60    | 84   | March/April 2026 |
| 14   | Sidamo G4      | Aroresa       | Natural | Conventional | $3.40    | 83   | March/April 2026 |
| 15   | Nekempti G4    | Kelem Wollega | Natural | Conventional | $3.36    | 80   | March/April 2026 |
| 16   | Nekempti G5    | Kelem Wollega | Natural | Conventional | $3.22    | 80   | March/April 2026 |
| 17   | Djimmah G4     | Bedelle       | Natural | Conventional | $3.34    | 79   | March/April 2026 |
| 18   | Djimmah G5     | Bedelle       | Natural | Conventional | $3.16    | 79   | March/April 2026 |

### 5.3 Station Information

**Washing Stations (Washed Coffee):**

| Region | Station               | Location                           |
| ------ | --------------------- | ---------------------------------- |
| Sidamo | Nensebo               | West Arsi                          |
| Guji   | Guduba Station        | Gotae Sodu Kebele, Hambella Woreda |
| Guji   | Sisay Washing Station | Haro Sorsa Kebele, Hambella Woreda |

**Drying Stations (Natural Coffee):**

| Region      | Station              | Location                         |
| ----------- | -------------------- | -------------------------------- |
| Yirgacheffe | Banko Gotiti Station | Bako Gotiti Kebele, Gedeb Woreda |
| Yirgacheffe | Wurae Station        | Halo Berti Kebele, Gedeb Woreda  |
| Jimma       | Agaro Drying Station | Jimma Zone                       |

### 5.4 Stock Locations

1. Addis Ababa, Ethiopia (FOB Djibouti)
2. Port Trieste, Italy (EXW)
3. Port Genoa, Italy (EXW)

### 5.5 Flavor Categories (for filtering)

Based on Covoya's flavor wheel and typical Ethiopian coffee profiles:

| Category    | Tasting Notes                                             |
| ----------- | --------------------------------------------------------- |
| Chocolate   | Milk chocolate, dark chocolate, cocoa                     |
| Caramel     | Caramel, brown sugar, toffee                              |
| Berry       | Blueberry, strawberry, raspberry, blackcurrant, red grape |
| Floral      | Jasmine, iris, rose, bergamot                             |
| Citrus      | Lemon, orange, lime, grapefruit                           |
| Stone Fruit | Apricot, peach, nectarine, plum                           |
| Sweet       | Honey, sugar, molasses                                    |
| Nutty       | Roasted nuts, almond                                      |
| Spice       | Cinnamon, clove, black tea                                |
| Tropical    | Tropical fruit, pineapple, mango                          |
| Winey       | Wine, red wine, winey                                     |

### 5.6 Tasting Notes by Coffee Type

**Washed Coffees (typical profiles):**

| Coffee                | Suggested Tasting Notes              |
| --------------------- | ------------------------------------ |
| Yirgacheffe G1 Washed | Lemon, jasmine, bergamot, black tea  |
| Sidamo G1 Washed      | Citrus, floral, honey, bright        |
| Guji G1 Washed        | Apricot, blackcurrant, iris, classic |
| Limmu G2 Washed       | Wine, floral, sweet                  |

**Natural Coffees (typical profiles):**

| Coffee                 | Suggested Tasting Notes          |
| ---------------------- | -------------------------------- |
| Yirgacheffe G1 Natural | Blueberry, strawberry, wine      |
| Sidamo G1 Natural      | Berry, chocolate, caramel        |
| Guji G1 Natural        | Peach, honey, tropical           |
| Djimmah G4/G5 Natural  | Cocoa, roasted nuts, brown sugar |
| Nekempti G4/G5 Natural | Earthy, spice, full-bodied       |

Note: Client should verify/provide actual tasting notes for each specific lot.

------

## 6. Technical Specifications

### 6.1 Current Stack

- **Framework:** Next.js 14 (App Router)
- **Hosting:** Netlify (demo)
- **Repository:** GitHub

### 6.2 Finalized Stack

- **Framework:** Next.js 14 (monorepo with API routes)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (email/password)
- **File Storage:** Firebase Storage (for product images)
- **Email:** Resend or SendGrid (for inquiry notifications to admin)
- **Hosting:** Vercel or Netlify (free tier)

### 6.3 Why Firebase

- Generous free tier (1GB storage, 50K reads/day, 20K writes/day)
- No inactivity pause or deletion policy
- Real-time updates (price changes reflect instantly)
- Firebase Auth handles registration, login, password reset out of the box
- Scales with usage, client pays only when they grow

### 6.4 Firestore Data Structure

```
/users/{uid}
  - email
  - role (buyer/admin)
  - status (pending/approved/rejected)
  - companyName
  - contactPerson
  - phone
  - country
  - companyType
  - createdAt
  - approvedAt

/coffees/{coffeeId}
  - name
  - station
  - region
  - grade
  - preparation
  - cropYear
  - certification
  - scaScore
  - tastingNotes[]
  - referenceCode
  - isActive
  - displayOrder
  - pricing: {
      addisAbaba: { price, availability, terms }
      trieste: { price, availability, terms }
      genoa: { price, availability, terms }
    }
  - updatedAt

/inquiries/{inquiryId}
  - userId
  - coffeeItems[]
  - quantity
  - preferredLocation
  - targetShipmentDate
  - message
  - status
  - adminNotes
  - createdAt
```

### 6.5 Authentication Flow

1. User registers with Firebase Auth (any email, not just Gmail)
2. On registration, create Firestore document in `/users/{uid}` with company details and `status: "pending"`
3. Admin receives email notification of new registration
4. Admin approves/rejects in dashboard, updates `status` field
5. User logs in, app checks Firestore for `status: "approved"` before showing pricing
6. Rejected or pending users see appropriate message

### 6.6 Deployment

- **Production:** Vercel or Netlify (client preference)
- **Demo:** Current Netlify deployment (greenacres-coffee.netlify.app)
- Environment variables for Firebase config
- Separate Firebase project for staging if needed

------

## 7. Pages and Routes

### 7.1 Public Routes

| Route            | Page              | Description                                   |
| ---------------- | ----------------- | --------------------------------------------- |
| /                | Home              | Landing page with hero, stats, coffee preview |
| /about           | About Us          | Company info, team, vision/mission            |
| /regions         | Regions           | Interactive Ethiopia map                      |
| /coffee          | Coffee Collection | Public preview (no prices)                    |
| /how-to-order    | How to Order      | Ordering process explanation                  |
| /contact         | Contact           | Contact form, map, details                    |
| /login           | Login             | Buyer login form                              |
| /register        | Register          | Buyer registration form                       |
| /forgot-password | Forgot Password   | Password reset request                        |

### 7.2 Buyer Routes (Protected)

| Route                | Page            | Description                       |
| -------------------- | --------------- | --------------------------------- |
| /portal              | Buyer Dashboard | Welcome, quick stats              |
| /portal/catalog      | Coffee Catalog  | Full catalog with pricing         |
| /portal/catalog/[id] | Coffee Detail   | Single coffee detail with inquiry |
| /portal/inquiries    | My Inquiries    | List of submitted inquiries       |
| /portal/profile      | My Profile      | Edit profile, change password     |

### 7.3 Admin Routes (Protected)

| Route            | Page               | Description                    |
| ---------------- | ------------------ | ------------------------------ |
| /admin           | Admin Login        | Admin authentication           |
| /admin/dashboard | Dashboard          | Overview, stats, quick actions |
| /admin/prices    | Price Management   | Update prices and availability |
| /admin/products  | Product Management | Add/edit/deactivate products   |
| /admin/users     | User Management    | Approve/reject, view buyers    |
| /admin/inquiries | Inquiries          | View and manage inquiries      |

------

## 8. Email Notifications

### 8.1 To Buyers

| Trigger                | Subject               | Content                                |
| ---------------------- | --------------------- | -------------------------------------- |
| Registration submitted | Registration Received | Confirmation, pending approval message |
| Registration approved  | Account Approved      | Welcome, login link                    |
| Registration rejected  | Registration Update   | Rejection notice with optional reason  |
| Inquiry submitted      | Inquiry Confirmation  | Summary of inquiry                     |

### 8.2 To Admin

| Trigger          | Subject                | Content                     |
| ---------------- | ---------------------- | --------------------------- |
| New registration | New Buyer Registration | Buyer details, approve link |
| New inquiry      | New Order Inquiry      | Inquiry details, buyer info |

------

## 9. Pending Items from Client

| Item                       | Status  | Notes                                         |
| -------------------------- | ------- | --------------------------------------------- |
| Staff photos               | Pending | Client said "I will send them to you shortly" |
| Station/processing photos  | Pending | For coffee listings and gallery               |
| Station/processing videos  | Pending | Optional, for coffee listings                 |
| Partner farmers count      | Pending | For statistics section                        |
| Export destinations count  | Pending | For statistics section                        |
| Company establishment year | Pending | Currently shows 2010, needs verification      |
| Logo (high resolution)     | Pending | PNG or SVG for social media setup             |
| Tasting notes per coffee   | Partial | Some in offer list, may need more detail      |

**Received from Client:**

- ✅ Offer list with 18 coffees (prices, grades, stations, SCA scores)
- ✅ Washing station details (3 stations)
- ✅ Drying station details (3 stations)
- ✅ Export volume (10,560+ tons)
- ✅ Contact email preference (ethiocof@greenacrescoffee.com)
- ✅ Stock locations (Addis Ababa, Trieste, Genoa)
- ✅ Pricing terms (FOB Djibouti, EXW European)
- ✅ LinkedIn profile exists (needs cleanup)
- ✅ Product card structure preference (Covoya-style)

------

## 10. Out of Scope

The following are explicitly not included in this project:

- E-commerce functionality (cart, checkout, payment processing)
- Order management system
- Shipping/logistics tracking
- Inventory management beyond stock status display
- Mobile app development
- Multi-language support (unless added as optional)
- Automated price feeds from external sources

------

## 11. Success Criteria

The project will be considered complete when:

1. Buyers can register and login to view live pricing
2. Admin can approve/reject registrations
3. Admin can update prices and stock levels daily
4. Buyers can submit inquiries through the platform
5. All inquiries are emailed to ethiocof@greenacrescoffee.com
6. Social media accounts are created and linked
7. Google Business Profile is set up
8. Website content is updated with correct information
9. Site is deployed and accessible at greenacrescoffee.com

------

## 12. Timeline Estimate

| Phase     | Tasks                                          | Duration      |
| --------- | ---------------------------------------------- | ------------- |
| Phase 1   | Database setup, authentication system          | 3-4 days      |
| Phase 2   | Admin dashboard (prices, users, inquiries)     | 4-5 days      |
| Phase 3   | Buyer portal (catalog, inquiry form)           | 3-4 days      |
| Phase 4   | Content updates, social media, Google Business | 2-3 days      |
| Phase 5   | Testing, bug fixes, deployment                 | 2-3 days      |
| **Total** |                                                | **2-3 weeks** |

------

## Appendix A: Design Reference

**Primary Inspiration:** Covoya Coffee (covoyacoffee.com)

**Client's Product Card Structure (from WhatsApp):**

Sisay provided this exact structure he wants for Ethiopian coffee cards:

```
1. PRODUCT TITLE (Top)
   ETHIOPIA SIDAMO NENSEBO – FULLY WASHED (2024)
   (or Guji / Yirgacheffe / Jimma etc.)

2. TASTING NOTES (Flavor Wheel Style)
   Washed: Lemon, bergamot, jasmine, honey, black tea
   Natural: Blueberry, strawberry, milk chocolate, caramel

3. INTERNAL REFERENCE CODE
   ET-SD-W1-24, ET-GJ-N4-24, etc.

4. LOCATION & STOCK STATUS
   Addis Ababa, Ethiopia: Pre-Shipment
   (appears just above the button)

5. ACTION BUTTON
   Log In To Buy / Sample
```

**Example Cards from Client:**

**Card 1 – Washed:**

- ETHIOPIA YIRGACHEFFE GEDEB – FULLY WASHED (2024)
- Tasting notes: Lemon, jasmine, black tea, honey
- Ref: ET-YG-W1-24
- Hamburg, Germany: In Stock

**Card 2 – Natural:**

- ETHIOPIA GUJI HAMBELLA – NATURAL GRADE 4 (2024)
- Tasting notes: Blueberry, red grape, milk chocolate
- Ref: ET-GJ-N4-24
- Djibouti Port: In Stock

**Card 3 – Natural (Jimma):**

- ETHIOPIA JIMMA AGARO – NATURAL GRADE 5 (2024)
- Tasting notes: Cocoa, roasted nuts, brown sugar
- Ref: ET-JM-N5-24
- Addis Ababa, Ethiopia: Pre-Shipment

**Current Design Elements (Keep):**

- Green color scheme (#2C5530, #4A7C59)
- Serif headings, sans-serif body
- Vintage coffee illustrations
- Golden gradient accent for Grade 1 coffees
- Hover effects revealing flavor notes

**Covoya Features to Incorporate:**

- Filter sidebar with flavor wheel filtering
- Product cards with origin map thumbnail
- Stock location with bag count
- Reference codes visible on cards
- Grid/List view toggle
- Sort dropdown (Position, Name, Price)
- TOP LOT badge for premium coffees

------

## Appendix B: Contact Information

**Client:**

- Name: Sisay Abebe Mulugeta
- Email: sisay@greenacrescoffee.com
- Inquiry Email: ethiocof@greenacrescoffee.com
- Phone: +251-935401179
- Address: Akaki Kality Subcity Woreda 07, Delta Complex Building, 5th Floor, Addis Ababa, Ethiopia

**Developer:**

- Company: Zaraytech Information Technology Co. L.L.C.
- Location: Dubai, UAE