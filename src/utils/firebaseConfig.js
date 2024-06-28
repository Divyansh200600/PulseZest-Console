import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCaBrxT4HXxYv03gli19ByspDXDkaNFGho",
    authDomain: "pulsezest-ffe99.firebaseapp.com",
    projectId: "pulsezest-ffe99",
    storageBucket: "pulsezest-ffe99.appspot.com",
    messagingSenderId: "434270739454",
    appId: "1:434270739454:web:f011c842e80cc51f1d7eaf",
    measurementId: "G-Z65N3GBVT3"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };