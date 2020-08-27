import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage';
// import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD3ONndJma3pdNlQgHCKH36TsjEhKRrKl0",
  authDomain: "gcm-marketplace.firebaseapp.com",
  databaseURL: "https://gcm-marketplace.firebaseio.com",
  projectId: "gcm-marketplace",
  storageBucket: "gcm-marketplace.appspot.com",
  messagingSenderId: "1000116117931",
  appId: "1:1000116117931:web:ab5c02e3ee473d7d15b2ee",
  measurementId: "G-FGBJDF82GG"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const database = firebase.database();
export const storage = firebase.storage();
// firebase.analytics();
export default firebase;