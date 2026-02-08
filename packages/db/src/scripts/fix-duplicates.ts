
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../../apps/web/.env.local') });

async function main() {
    // Dynamically import logic
    const { getCoffees, deleteCoffee } = await import('../collections/coffees');

    console.log("☕️ Fetching all coffees...");
    const coffees = await getCoffees(false);

    // Group by name
    const grouped: Record<string, typeof coffees> = {};
    coffees.forEach(c => {
        if (!grouped[c.name]) grouped[c.name] = [];
        grouped[c.name].push(c);
    });

    let deletedCount = 0;

    for (const [name, items] of Object.entries(grouped)) {
        if (items.length > 1) {
            console.log(`Found ${items.length} duplicates for "${name}":`);

            // Sort by updatedAt descending (newest first)
            // If updatedAt is same, sort by ID to be deterministic
            items.sort((a, b) => {
                const dateA = new Date(a.updatedAt).getTime();
                const dateB = new Date(b.updatedAt).getTime();
                return dateB - dateA;
            });

            const keep = items[0];
            const remove = items.slice(1);

            console.log(`   Keeping: [${keep.id}] (Updated: ${keep.updatedAt})`);

            for (const item of remove) {
                console.log(`   Deleting: [${item.id}] (Updated: ${item.updatedAt})`);
                try {
                    await deleteCoffee(item.id);
                    deletedCount++;
                    console.log(`       ✅ Deleted ${item.id}`);
                } catch (err: unknown) {
                    console.error(`       ❌ Failed to delete ${item.id}:`, err);
                }
            }
        }
    }

    console.log(`\nCleanup complete. Deleted ${deletedCount} duplicate records.`);
}

main().catch(console.error);
