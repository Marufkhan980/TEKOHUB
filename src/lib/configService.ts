import {
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { StoreConfig } from '../types';
import { DEFAULT_STORE_CONFIG } from '../data/storeConfig';

const CONFIG_COLLECTION = 'store_config';
const CONFIG_DOC_ID = 'general';

/**
 * Subscribes to real-time store configuration from Firebase Firestore.
 * Ensures Vercel, Google Sites, and local environments all share the exact same
 * live bKash/Nagad/Rocket numbers and delivery charges.
 */
export function subscribeToStoreConfig(
  onSuccess: (config: StoreConfig) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<StoreConfig>;
        const merged: StoreConfig = {
          ...DEFAULT_STORE_CONFIG,
          ...data
        };
        onSuccess(merged);
      } else {
        // Fallback to defaults if not yet created in Firestore
        onSuccess(DEFAULT_STORE_CONFIG);
      }
    },
    (error) => {
      console.warn('Firestore store_config subscription error, using default config:', error);
      onSuccess(DEFAULT_STORE_CONFIG);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Saves store configuration (bKash, Nagad, Rocket, delivery charges, contact info)
 * to Firebase Firestore.
 * Requires Firebase Auth (Store Owner).
 */
export async function saveStoreConfigToFirestore(config: StoreConfig): Promise<void> {
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);

  const toSave: Record<string, any> = { ...config };

  // Remove any undefined values
  Object.keys(toSave).forEach((key) => {
    if (toSave[key] === undefined) {
      delete toSave[key];
    }
  });

  await setDoc(docRef, toSave, { merge: true });
}
