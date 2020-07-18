import firebase from 'firebase';

const firebaseapp = firebase.initializeApp({
  apiKey: "AIzaSyDV8Q9jN7UrfsL149ayCTa7a7L2ZdS3irQ",
  authDomain: "instagram-react-clone-a3cfc.firebaseapp.com",
  databaseURL: "https://instagram-react-clone-a3cfc.firebaseio.com",
  projectId: "instagram-react-clone-a3cfc",
  storageBucket: "instagram-react-clone-a3cfc.appspot.com",
  messagingSenderId: "253127424014",
  appId: "1:253127424014:web:0a47b7861899470161a45f"
});

const db = firebaseapp.firestore();
const auth = firebaseapp.auth();
const storage = firebase.storage();

export { db, auth, storage };