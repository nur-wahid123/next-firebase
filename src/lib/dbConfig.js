// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-pgrpvFr-q8i10NKxuUzqp34cF48TNQM",
  authDomain: "next-firebase-c1215.firebaseapp.com",
  projectId: "next-firebase-c1215",
  storageBucket: "next-firebase-c1215.appspot.com",
  messagingSenderId: "691738116034",
  appId: "1:691738116034:web:fc950f1e7d35de096ce05b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const user = collection(db, "users");
