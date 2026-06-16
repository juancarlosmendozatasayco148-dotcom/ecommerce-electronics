import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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
  const cred = await signInWithPopup(auth, provider);
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', cred.user.uid), {
      name: cred.user.displayName,
      email: cred.user.email,
      photoURL: cred.user.photoURL,
      role: 'user',
      createdAt: serverTimestamp(),
    });
  }
  return cred.user;
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
