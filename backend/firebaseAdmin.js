import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseAdmin;
let db;

try {
  // Initialize Firebase Admin
  // Option 1: Use service account key file
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountPath) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'loanpathfinder-dce3a'
    });
  } else {
    // Option 2: Use environment variables (for production)
    // Or use Application Default Credentials (for GCP)
    firebaseAdmin = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'loanpathfinder-dce3a'
    });
  }
  
  db = admin.firestore();
  
  console.log('✅ Firebase Admin initialized successfully');
  console.log('📊 Project ID:', firebaseAdmin.projectId);
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  console.error('💡 Make sure you have:');
  console.error('   1. Set FIREBASE_PROJECT_ID in .env');
  console.error('   2. Set FIREBASE_SERVICE_ACCOUNT_KEY path to service account JSON file');
  console.error('   3. Or use Application Default Credentials in production');
  throw error;
}

export { firebaseAdmin, db };
export default db;

