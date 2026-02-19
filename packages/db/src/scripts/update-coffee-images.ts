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
      // Build updated images array: jute bag first, then keep non-jute gallery images
      const existingImages: string[] = data.images || [];
      const filteredImages = existingImages.filter(
        (img: string) =>
          !img.includes("jute-bag") && !img.includes("coffee-sack"),
      );
      const updatedImages = [newImage, ...filteredImages];

      await doc.ref.update({
        imageUrl: newImage,
        images: updatedImages,
      });
      console.log(
        `✅ Updated ${data.name} -> ${newImage} (images: ${updatedImages.length})`,
      );
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
