import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Usually you would load this from a JSON file.
// For example:
// import serviceAccount from "../serviceAccountKey.json";
// 
// If you don't have it yet, you need to download it from Firebase Console -> Project Settings -> Service Accounts
// 
// Or you can pass it as an environment variable (JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
//
// Here we do a safe init

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      // credential: admin.credential.cert(serviceAccount) 
    });
  }
} catch (error) {
  console.error("Firebase admin init error", error);
}

export const adminAuth = admin.auth();
