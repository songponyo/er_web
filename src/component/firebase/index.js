import firebase from "firebase";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDyTUdDcKCq67cuR-nOkX0GdkJzdO3EIGc",
  authDomain: "elearnning-323808.firebaseapp.com",
  projectId: "elearnning-323808",
  storageBucket: "elearnning-323808.appspot.com",
  messagingSenderId: "1061786570855",
  appId: "1:1061786570855:web:0c72100dddceb9853604c2",
  measurementId: "G-161XE43FYJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
