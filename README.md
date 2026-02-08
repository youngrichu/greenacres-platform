# Greenacres Coffee Trading Platform

A B2B coffee trading platform for Green Acres Industrial PLC, an Ethiopian premium coffee exporter.

## Project Structure

This is a monorepo managed with [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/).

```
coffee/
├── apps/
│   ├── web/          # Public website + Buyer Portal (Next.js)
│   └── admin/        # Admin Dashboard (Next.js)
├── packages/
│   ├── auth/         # Firebase Authentication logic
│   ├── db/           # Firebase/Firestore data layer
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- A Firebase project

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd coffee
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Firebase**
   
   Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your Firebase project credentials:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project (or create one)
   - Go to Project Settings > General > Your apps > Web app
   - Copy the config values to `.env.local`

4. **Run the development servers**
   ```bash
   # Run both apps
   pnpm dev
   
   # Or run individually
   pnpm --filter @greenacres/web dev      # Web app on http://localhost:3000
   pnpm --filter @greenacres/admin dev    # Admin on http://localhost:3001
   ```

## Firebase Setup

### Firestore Collections

The app uses the following Firestore collections:

- `users` - Registered buyers and admins
- `coffees` - Coffee product listings
- `inquiries` - Buyer inquiries

### Authentication

Firebase Auth is used with email/password authentication.

### Creating an Admin User

1. Register a user through the normal registration flow
2. In Firebase Console, go to Firestore
3. Find the user document in the `users` collection
4. Change `role` from `"buyer"` to `"admin"`
5. Change `status` from `"pending"` to `"approved"`

## Development

### Available Scripts

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages/apps
pnpm lint         # Lint all packages/apps
pnpm typecheck    # Type-check all packages/apps
```

### Adding Shared Components

1. Add components to `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Import in apps: `import { Button } from '@greenacres/ui'`

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Monorepo:** Turborepo
- **Package Manager:** pnpm

## License

Private - Green Acres Industrial PLC
