import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDg0PxdMQn_-9VfsEHfmkHxmgKBAsgmAg",
  authDomain: "desafo-flugo.firebaseapp.com",
  projectId: "desafo-flugo",
  storageBucket: "desafo-flugo.firebasestorage.app",
  messagingSenderId: "636293961017",
  appId: "1:636293961017:web:2c15d1d1021e79bac184e8",
  measurementId: "G-41YZ9XYTJP"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
