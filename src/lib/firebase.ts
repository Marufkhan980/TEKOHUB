import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import localConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
  appId: env.VITE_FIREBASE_APP_ID || localConfig.appId,
  apiKey: env.VITE_FIREBASE_API_KEY || localConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId
};

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific database ID if configured
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Firebase Authentication
const auth = getAuth(app);

// Validate connection on startup per Firebase integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline. Cached/local fallback will be active.");
    }
  }
}
testConnection();

export { app, db, auth };
