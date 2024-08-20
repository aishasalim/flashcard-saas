import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyD0yl3kH1U5oD0XFJLEifwXEy5rEPlUL9A",
  authDomain: "flashcardsaas-72583.firebaseapp.com",
  projectId: "flashcardsaas-72583",
  storageBucket: "flashcardsaas-72583.appspot.com",
  messagingSenderId: "376186688812",
  appId: "1:376186688812:web:c2400d858efbd504cf0889",
  measurementId: "G-7PC3ZTKJ25"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
const db = getFirestore(app);


export { db };
