import "dotenv/config";

import admin from "firebase-admin";

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;

if (!serviceAccountPath) {
  console.log("Error: Service_Acount_Key_Path is not set in file .env");
  process.exit(1);
}

let serviceAccount;

try {
  serviceAccount = serviceAccountPath;
  console.log("Success: Read File Service Account Path");
} catch (error) {
  console.error(`Error: Error Read Account Path: ${serviceAccountPath}`);
  console.error(error);
  process.exit(1);
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://location-car-513da-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

console.log("Firebase Admin SDK Success !");

const firebaseStoreDB = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const realtimeDB = admin.database();
const adminSdk = admin;

export { firebaseStoreDB, auth, storage, realtimeDB, adminSdk};
