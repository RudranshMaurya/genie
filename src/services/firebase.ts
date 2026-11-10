import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA8YzcC1zEu4XMBW4Aubk6ITVtDzvM37sc",
  authDomain: "genie-80cae.firebaseapp.com",
  databaseURL: "https://genie-80cae-default-rtdb.firebaseio.com",
  projectId: "genie-80cae",
  storageBucket: "genie-80cae.firebasestorage.app",
  messagingSenderId: "266984572651",
  appId: "1:266984572651:web:82b188572ae23d4be920ae",
  measurementId: "G-WPZPCWSCFY"
};

export const isFirebaseConfigured = true;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
export default app;
