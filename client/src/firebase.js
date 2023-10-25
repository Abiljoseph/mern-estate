// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-fd235.firebaseapp.com",
  projectId: "mern-estate-fd235",
  storageBucket: "mern-estate-fd235.appspot.com",
  messagingSenderId: "238570140412",
  appId: "1:238570140412:web:7c16349ab014af82b2dd79",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
