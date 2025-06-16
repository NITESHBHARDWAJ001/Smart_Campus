// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging,onMessage,getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCjsk7rHNwTGvLTBZF2fRAWLmIkDE1oVgk",
  authDomain: "sample-6f14d.firebaseapp.com",
  projectId: "sample-6f14d",
  storageBucket: "sample-6f14d.firebasestorage.app",
  messagingSenderId: "162043180364",
  appId: "1:162043180364:web:2cdb88602d82cbffed0be9"
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export {  messaging, getToken, onMessage };