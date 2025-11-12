import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnYXF7RGdihIvGYG8yg2-Sa6_sndCSk58",
  authDomain: "flow-c6163.firebaseapp.com",
  projectId: "flow-c6163",
  storageBucket: "flow-c6163.firebasestorage.app",
  messagingSenderId: "117376198974",
  appId: "1:117376198974:web:387ffba9f5763148d2a46f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }