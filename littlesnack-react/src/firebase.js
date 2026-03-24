import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFPhlWCCWwvpT2_dB_hPTgFWB8oJ8gPLI",
  authDomain: "veb-1-1fd82.firebaseapp.com",
  projectId: "veb-1-1fd82",
  storageBucket: "veb-1-1fd82.firebasestorage.app",
  messagingSenderId: "137481838299",
  appId: "1:137481838299:web:96180a8622d8ea0dbc36fe",
  measurementId: "G-K7ZH8XWYTB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
