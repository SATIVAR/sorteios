"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "sativar-sorteios",
  "appId": "1:1070102276900:web:1766545479cc71dbc0a1b1",
  "storageBucket": "sativar-sorteios.firebasestorage.app",
  "apiKey": "AIzaSyDeql7pVq2nA9IQxZrgUi-wT7sB-IybLL8",
  "authDomain": "sativar-sorteios.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1070102276900"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
