
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  collection, doc, getDoc, getDocs, setDoc, 
  updateDoc, deleteDoc, query, where
} from 'firebase/firestore';
import { db } from '@/config/firebase';

interface FirebaseContextType {
  getDocument: <T>(collectionName: string, docId: string) => Promise<T | null>;
  getAllDocuments: <T>(collectionName: string) => Promise<T[]>;
  createDocument: <T>(collectionName: string, docId: string, data: T) => Promise<void>;
  updateDocument: <T>(collectionName: string, docId: string, data: Partial<T>) => Promise<void>;
  deleteDocument: (collectionName: string, docId: string) => Promise<void>;
  getUserDocuments: <T>(collectionName: string, userId: string) => Promise<T[]>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const getDocument = async <T,>(collectionName: string, docId: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  const getAllDocuments = async <T,>(collectionName: string): Promise<T[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error("Error getting documents:", error);
      return [];
    }
  };

  const createDocument = async <T,>(collectionName: string, docId: string, data: T): Promise<void> => {
    try {
      await setDoc(doc(db, collectionName, docId), data);
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  };

  const updateDocument = async <T,>(collectionName: string, docId: string, data: Partial<T>): Promise<void> => {
    try {
      await updateDoc(doc(db, collectionName, docId), data as any);
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };

  const getUserDocuments = async <T,>(collectionName: string, userId: string): Promise<T[]> => {
    try {
      const q = query(collection(db, collectionName), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error("Error getting user documents:", error);
      return [];
    }
  };

  return (
    <FirebaseContext.Provider value={{
      getDocument,
      getAllDocuments,
      createDocument,
      updateDocument,
      deleteDocument,
      getUserDocuments
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
