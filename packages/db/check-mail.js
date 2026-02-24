const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./service-account.json");

initializeApp({
  credential: cert(serviceAccount),
  projectId: "greenacres-coffee",
});

const db = getFirestore();

async function checkMail() {
  console.log("Fetching last 5 emails from 'mail' collection...");
  const snapshot = await db.collection("emails").get();

  if (snapshot.empty) {
    console.log("No mail documents found.");
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`\n--- Document ID: ${doc.id} ---`);
    console.dir(data, { depth: null });
  });
}

checkMail().catch(console.error);
