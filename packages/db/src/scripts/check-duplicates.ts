
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, '../../../../apps/web/.env.local') });

async function main() {
    // Dynamically import logic after env vars are loaded
    const { getCoffees } = await import('../collections/coffees');

    console.log("☕️ Fetching all coffees...");
    const coffees = await getCoffees(false); // Get all, including inactive

    console.log(`Found ${coffees.length} coffees.`);

    coffees.forEach(c => {
        console.log(`[${c.id}] ${c.name} (Active: ${c.isActive})`);
    });
}

main().catch(console.error);
