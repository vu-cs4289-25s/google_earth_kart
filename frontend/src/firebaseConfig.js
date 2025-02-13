// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkxxOc5LxNA4x0E8f56D5xbutkLgtHxEk",
  authDomain: "earth-kart.firebaseapp.com",
  projectId: "earth-kart",
  storageBucket: "earth-kart.firebasestorage.app",
  messagingSenderId: "813592878469",
  appId: "1:813592878469:web:32ae18f3bb366d40e238ec",
  measurementId: "G-L31GKDC4KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;