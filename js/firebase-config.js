// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNVgcX5iTAmm_6zA0S1FlZYcEQLsjCV4M",
  authDomain: "budget-eaf01.firebaseapp.com",
  projectId: "budget-eaf01",
  storageBucket: "budget-eaf01.firebasestorage.app",
  messagingSenderId: "338754753823",
  appId: "1:338754753823:web:af1a8b7bf83559a3f08c2a",
  measurementId: "G-MZCE13FTL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
