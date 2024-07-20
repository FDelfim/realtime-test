import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';



export default firebase;

const app = initializeApp({
    apiKey: "AIzaSyA0YdC3NVFkxpwjmZ-DMKsWDDrgjXIBB00",
    authDomain: "realtime-database-2d027.firebaseapp.com",
    projectId: "realtime-database-2d027",
    storageBucket: "realtime-database-2d027.appspot.com",
    messagingSenderId: "457138982910",
    appId: "1:457138982910:web:50ca4a2f7e84f3e5fb7aaf"
});

const db = getFirestore();
export const auth = getAuth();
export { db }