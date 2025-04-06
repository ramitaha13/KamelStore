// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAV-jLcT9gSErE8hz_-JBZYecyuJxkTmjY",
  authDomain: "kamel-store-b27c5.firebaseapp.com",
  projectId: "kamel-store-b27c5",
  storageBucket: "kamel-store-b27c5.firebasestorage.app",
  messagingSenderId: "154951358407",
  appId: "1:154951358407:web:b884ed9aa3969eab52abe2",
  measurementId: "G-SKRPGWJZX4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
