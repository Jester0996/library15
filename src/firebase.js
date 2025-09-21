// // Конфигурация проекта Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyD1RPOt8c-TTmh5ZFN749GhH8VOlxlpHYg",
//   authDomain: "library-61c07.firebaseapp.com",
//   projectId: "library-61c07",
//   storageBucket: "library-61c07.appspot.com",
//   messagingSenderId: "224581553599",
//   appId: "1:224581553599:web:cfd84a83452e79dd8be50a",
//   measurementId: "G-8WP18K1VCC",
// };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Конфигурация проекта Firebase из .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
