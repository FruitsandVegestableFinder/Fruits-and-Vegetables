import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCHcqCP9yAErY-gbRQ8EQ9sBFrqO8tFO3o",
  authDomain: "fruits-and-vegetable-fin-a9251.firebaseapp.com",
  projectId: "fruits-and-vegetable-fin-a9251",
  storageBucket: "fruits-and-vegetable-fin-a9251.appspot.com",
  messagingSenderId: "543847812838",
  appId: "1:543847812838:web:34ea55be86cf71829df527",
  measurementId: "G-5MTSRYCD9L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

