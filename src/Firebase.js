import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// initialise the firebase app
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD3iPpBbe1mlKo5EAZj3cUuku8izd7xdms",
    authDomain: "instagram-clone-pv.firebaseapp.com",
    projectId: "instagram-clone-pv",
    storageBucket: "instagram-clone-pv.appspot.com",
    messagingSenderId: "350739962894",
    appId: "1:350739962894:web:7ac96475c8991d2c34705f"
  });
  const db=firebaseApp.firestore();
  const auth= firebase.auth();
  const storage= firebase.storage();

  export {db, auth, storage};