import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA6hEth0ifgQLgJv7mNr5686WNIyuBIYHE",
    authDomain: "login-pulsezest.firebaseapp.com",
    projectId: "login-pulsezest",
    storageBucket: "login-pulsezest.appspot.com",
    messagingSenderId: "882516520245",
    appId: "1:882516520245:web:a462acbf725bccf12f707c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };