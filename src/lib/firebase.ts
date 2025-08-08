// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
