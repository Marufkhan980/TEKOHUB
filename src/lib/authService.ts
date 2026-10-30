import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export { auth };

/**
 * Reads the verified store owner email dynamically from environment variables
 */
export const getAuthorizedAdminEmail = (): string => {
  return (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
};

export const AUTHORIZED_ADMIN_EMAIL: string = (import.meta.env.VITE_ADMIN_EMAIL || '').trim();

export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const configured = getAuthorizedAdminEmail();
  if (!configured) return false;
  return email.trim().toLowerCase() === configured;
}

const googleProvider = new GoogleAuthProvider();
// Force account selection so owner can easily select their designated Google account
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Signs in the store administrator strictly using Google Sign-In.
 * Only the email defined in VITE_ADMIN_EMAIL is permitted.
 * Any other Google account is immediately rejected, blocked, and logged out.
 */
export async function loginAdminWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  if (!isAuthorizedAdmin(user.email)) {
    // Immediately terminate session for unauthorized accounts
    await signOut(auth);
    const ownerEmail = getAuthorizedAdminEmail();
    const err: any = new Error(
      `Access Denied: '${user.email || 'Unknown account'}' is not authorized. Only the verified store owner (${ownerEmail}) can access store management.`
    );
    err.code = 'auth/unauthorized-account';
    throw err;
  }

  return user;
}

/**
 * Logs out the administrator, terminating the session.
 */
export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribes to Firebase Auth state changes.
 * Automatically kicks out any session whose email does not match VITE_ADMIN_EMAIL.
 */
export function onAdminAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (isAuthorizedAdmin(user.email)) {
        callback(user);
      } else {
        // Force sign out unauthorized account
        await signOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
