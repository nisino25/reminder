import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyCCmmWR_0YVQVq1ucbukJX8P00WeMCMC20",
  authDomain: "reminder-8fc73.firebaseapp.com",
  projectId: "reminder-8fc73",
  storageBucket: "reminder-8fc73.appspot.com",
  messagingSenderId: "1099177339414",
  appId: "1:1099177339414:web:605aa4e8a0e2b588052337",
  measurementId: "G-LMGTERJY5G"
};

 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;