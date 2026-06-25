import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './auth';

export const saveStoreConfig = async (userId: string, data: any) => {
  if (!userId) return;
  const storeRef = doc(db, 'stores', userId);
  await setDoc(storeRef, data, { merge: true });
};

export const getStoreConfig = async (userId: string) => {
  if (!userId) return null;
  const storeRef = doc(db, 'stores', userId);
  const docSnap = await getDoc(storeRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Notes, Events, Checklists
export const saveUserData = async (userId: string, collectionName: string, docId: string, data: any) => {
  if (!userId) return;
  const docRef = doc(db, `users/${userId}/${collectionName}`, docId);
  await setDoc(docRef, data, { merge: true });
};

export const getUserDataList = async (userId: string, collectionName: string) => {
  if (!userId) return [];
  const colRef = collection(db, `users/${userId}/${collectionName}`);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
