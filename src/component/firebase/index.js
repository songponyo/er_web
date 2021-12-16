import firebase from "firebase";
import "firebase/storage";

// Your web app's Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyA8nJBch1cm7SXHMIZzT7HD28HYV1UwPAo",
  authDomain: "elearnning-b40d1.firebaseapp.com",
  projectId: "elearnning-b40d1",
  storageBucket: "elearnning-b40d1.appspot.com",
  messagingSenderId: "430908378378",
  appId: "1:430908378378:web:bcbd0eb9c90064028a3ef3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
