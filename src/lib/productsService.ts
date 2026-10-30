import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';
import { convertGoogleDriveUrl } from '../utils/imageUrl';

const PRODUCTS_COLLECTION = 'products';

/**
 * Subscribes to real-time product updates from Firebase Firestore.
 * If the collection is empty, gracefully falls back to DEFAULT_PRODUCTS.
 */
export function subscribeToProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, PRODUCTS_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        // Fallback to default catalog if Firestore has not been seeded yet
        onSuccess(DEFAULT_PRODUCTS);
      } else {
        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          const mainImg = convertGoogleDriveUrl(data.image || '');
          const gallery = (data.gallery && data.gallery.length > 0)
            ? data.gallery.map(convertGoogleDriveUrl)
            : [mainImg];

          loaded.push({
            ...data,
            id: docSnap.id,
            image: mainImg,
            gallery
          });
        });
        onSuccess(loaded);
      }
    },
    (error) => {
      console.warn('Firestore subscription notice, using fallback catalog:', error);
      onSuccess(DEFAULT_PRODUCTS);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Saves or updates a product in Firestore.
 * Requires Firebase Auth (Admin).
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const cleanImage = convertGoogleDriveUrl(product.image);
  const cleanGallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery.map((url) => convertGoogleDriveUrl(url))
      : [cleanImage];

  const toSave: Record<string, any> = {
    ...product,
    image: cleanImage,
    gallery: cleanGallery
  };

  // Remove undefined fields so Firestore doesn't reject the write
  Object.keys(toSave).forEach((key) => {
    if (toSave[key] === undefined) {
      delete toSave[key];
    }
  });

  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(docRef, toSave, { merge: true });
}

/**
 * Deletes a product from Firestore.
 * Requires Firebase Auth (Admin).
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Seeds all default TekoHub gadgets into Firestore in a single batch.
 * Requires Firebase Auth (Admin).
 */
export async function seedProductsToFirestore(): Promise<number> {
  const batch = writeBatch(db);
  DEFAULT_PRODUCTS.forEach((p) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, p.id);
    batch.set(docRef, {
      ...p,
      image: convertGoogleDriveUrl(p.image)
    });
  });
  await batch.commit();
  return DEFAULT_PRODUCTS.length;
}