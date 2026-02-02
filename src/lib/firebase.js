// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getDatabase } from "firebase/database";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAHp3I7e7JDAc9qIezdxJWAkIHvkXZkk6U",
//   authDomain: "metamark-b4924.firebaseapp.com",
//   projectId: "metamark-b4924",
//   storageBucket: "metamark-b4924.firebasestorage.app",
//   messagingSenderId: "518176488686",
//   appId: "1:518176488686:web:440c30cc70bd46cb8187ff",
//   measurementId: "G-WFJE6FWLCS"
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// export const db = getDatabase(app)


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAHp3I7e7JDAc9qIezdxJWAkIHvkXZkk6U",
  authDomain: "metamark-b4924.firebaseapp.com",
  projectId: "metamark-b4924",
  storageBucket: "metamark-b4924.firebasestorage.app",
  messagingSenderId: "518176488686",
  appId: "1:518176488686:web:440c30cc70bd46cb8187ff",
  measurementId: "G-WFJE6FWLCS",
  // ✅ Apni exact Console wali URL yahan confirm kar lena
  databaseURL: "https://metamark-b4924-default-rtdb.firebaseio.com" 
};

// ✅ FIX: Check if Firebase is already initialized
// Agar apps array ki length 0 se badi hai, toh purana app use karo, warna naya initialize karo.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const analytics = getAnalytics(app);
export const db = getDatabase(app);