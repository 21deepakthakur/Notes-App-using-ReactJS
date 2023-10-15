import { initializeApp } from "firebase/app";
import {getFirestore, collection} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB1f2od4tUQ9pqpGQRMCmBT6WBroOm7h8s",
  authDomain: "react-notes-3ed79.firebaseapp.com",
  projectId: "react-notes-3ed79",
  storageBucket: "react-notes-3ed79.appspot.com",
  messagingSenderId: "76253027709",
  appId: "1:76253027709:web:4de855bbfee651fafb4014"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")