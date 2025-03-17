import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage for Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBNegvx2fKklYZO3ubaqlJi4ODUumaxYww",
  authDomain: "chatapp-37e8f.firebaseapp.com",
  projectId: "chatapp-37e8f",
  storageBucket: "chatapp-37e8f.appspot.com", // Fixed typo in the bucket URL
  messagingSenderId: "839492819210",
  appId: "1:839492819210:web:9382c2df3b341f6170c2f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // Link auth to the app instance
export const db = getFirestore(app); // Link Firestore to the app instance
export const storage = getStorage(app); // Link Storage to the app instance
