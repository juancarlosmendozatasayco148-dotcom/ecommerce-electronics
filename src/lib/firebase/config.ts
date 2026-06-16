import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  if (!firebaseConfig.apiKey) return null;
  if (getApps().length > 0) return getApps()[0];
  try {
    return initializeApp(firebaseConfig);
  } catch {
    return null;
  }
}

const app = getFirebaseApp();
const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);
const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);
const storage = app ? getStorage(app) : (null as unknown as ReturnType<typeof getStorage>);

export { db, auth, storage };
export default app;
