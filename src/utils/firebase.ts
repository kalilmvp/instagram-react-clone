import firebase from 'firebase';

const firebaseapp = firebase.initializeApp({
  apiKey: <YOUR_APP>,
  authDomain: <YOUR_APP>,
  databaseURL: <YOUR_APP>,
  projectId: <YOUR_APP>,
  storageBucket: <YOUR_APP>,
  messagingSenderId: <YOUR_APP>,
  appId: <YOUR_APP>
});

const db = firebaseapp.firestore();
const auth = firebaseapp.auth();
const storage = firebase.storage();

export { db, auth, storage };