import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key').replace(/['"]/g, '').trim(),
  authDomain:        typeof window !== 'undefined' ? window.location.host : (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com').replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/['"]/g, '').trim(),
  projectId:         (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project').replace(/['"]/g, '').trim(),
  storageBucket:     (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com').replace(/['"]/g, '').trim(),
  messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789').replace(/['"]/g, '').trim(),
  appId:             (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:123').replace(/['"]/g, '').trim(),
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);
export default app;
