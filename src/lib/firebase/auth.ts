import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User } from '@/types';

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signUp(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    role: 'user',
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const cred = await signInWithPopup(auth, provider);
    await createUserDocIfNeeded(cred.user);
    return cred.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
}

async function createUserDocIfNeeded(user: FirebaseUser) {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: 'user',
      createdAt: serverTimestamp(),
    });
  }
}

export async function handleGoogleRedirect(): Promise<FirebaseUser | null> {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  await createUserDocIfNeeded(result.user);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export async function getUserData(uid: string): Promise<User | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { uid, ...docSnap.data() } as User;
}

export async function updateProfilePhoto(uid: string, photoURL: string) {
  await updateDoc(doc(db, 'users', uid), { photoURL });
}

export async function removeProfilePhoto(uid: string) {
  await updateDoc(doc(db, 'users', uid), { photoURL: '' });
}
