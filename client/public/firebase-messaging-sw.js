importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCjsk7rHNwTGvLTBZF2fRAWLmIkDE1oVgk",
  authDomain: "sample-6f14d.firebaseapp.com",
  projectId: "sample-6f14d",
  storageBucket: "sample-6f14d.firebasestorage.app",
  messagingSenderId: "162043180364",
  appId: "1:162043180364:web:2cdb88602d82cbffed0be9"
});

const messaging = firebase.messaging();