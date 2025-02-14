import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load your service account key JSON file
const serviceAccount = JSON.parse(
    readFileSync(
        "./earth-kart-firebase-adminsdk-fbsvc-ae1c5ecb2f.json",
        "utf8",
    ),
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
