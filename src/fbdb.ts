import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

const appSettings = {
    apiKey: "AIza....",                             // Auth / General Use
    authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
    databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
    storageBucket: "YOUR_APP.appspot.com",          // Storage
    messagingSenderId: "123456789"                  // Cloud Messaging
  }

const app = initializeApp(appSettings);
const db = getDatabase(app, "http://localhost:9000");

