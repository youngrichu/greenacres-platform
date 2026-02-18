import dotenv from "dotenv";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../../../apps/web/.env.local"),
});

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error(
    "Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local",
  );
  process.exit(1);
}

// Initialize Firebase Admin
if (getApps().length === 0) {
  try {
    const serviceAccountPath = path.resolve(
      __dirname,
      "../../service-account.json",
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  } catch {
    console.log("Using Application Default Credentials...");
    initializeApp({ projectId });
  }
}

const db = getFirestore();
const COLLECTIONS = { COFFEES: "coffees" };

const imageUpdates: Record<string, string> = {
  "Sidamo Nensebo Refisa": "/assets/coffees/jute-bag-sidamo.png",
  "Guji Guduba Wet Mill": "/assets/coffees/jute-bag-guji-guduba.png",
  "Guji Gotae Sodu": "/assets/coffees/jute-bag-guji-gotae.png",
  "Guji Haro Sorsa (Sisay Station)": "/assets/coffees/jute-bag-guji-haro.png",
  "Yirgacheffe Banko Gotiti": "/assets/coffees/jute-bag-yirgacheffe-banko.png",
  "Yirgacheffe Wurae (Halo Berti)":
    "/assets/coffees/jute-bag-yirgacheffe-wurae.png",
  "Jimma Agaro Genji Challa": "/assets/coffees/jute-bag-jimma-agaro.png",
};

async function updateCoffeeImages() {
  console.log("Updating coffee images...");
  const coffeesRef = db.collection(COLLECTIONS.COFFEES);
  const snapshot = await coffeesRef.get();

  let updatedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const newImage = imageUpdates[data.name];

    if (newImage) {
      await doc.ref.update({
        imageUrl: newImage,
        // Also update the images array to include this as the first item if needed
        // For now, we just set the main imageUrl which is what DetailView uses
      });
      console.log(`✅ Updated ${data.name} -> ${newImage}`);
      updatedCount++;
    }
  }

  console.log(`Update complete. Modified ${updatedCount} documents.`);
}

// Run
if (require.main === module) {
  updateCoffeeImages()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
