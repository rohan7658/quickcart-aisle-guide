
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe29pEpbniIEHt9m5_jn2YX2n9KFTB69M",
  authDomain: "quickcart-43b96.firebaseapp.com",
  projectId: "quickcart-43b96",
  storageBucket: "quickcart-43b96.firebasestorage.app",
  messagingSenderId: "1098411892666",
  appId: "1:1098411892666:web:b8e7d5bc8a70caef18c783",
  measurementId: "G-PP41NBPZHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Use Firebase emulator if in development environment
if (import.meta.env.DEV) {
  try {
    // Uncomment this when you want to use Firebase emulators
    // connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Using Firebase emulator');
  } catch (error) {
    console.error('Failed to connect to Firebase emulator:', error);
  }
}

export { app, auth, db };
