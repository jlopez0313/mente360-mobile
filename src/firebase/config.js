import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAeuloB8bLsxG8IemN4WGGFCH5toCW5ZTE",
  authDomain: "mente-360.firebaseapp.com",
  projectId: "mente-360",
  storageBucket: "mente-360.appspot.com",
  messagingSenderId: "29037902198",
  appId: "1:29037902198:web:97caa8ef8206349e766257"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { firebaseConfig, app, auth }
