// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB89c4pgmBjKC8f9GKoOnO83nmrcUCBSJI",
  authDomain: "hireready-6393b.firebaseapp.com",
  databaseURL: "https://hireready-6393b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hireready-6393b",
  storageBucket: "hireready-6393b.firebasestorage.app",
  messagingSenderId: "233656035687",
  appId: "1:233656035687:web:dabf46229d2f27d0c1e7c2",
  measurementId: "G-30YJ0HBB8E"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);
