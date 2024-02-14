import { initializeApp } from "firebase/app";
import {getFireStore} from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC7BsSf_pxgehG0pk-MAnWTO8iybXweXxk",
  authDomain: "survayapp-6a6a1.firebaseapp.com",
  projectId: "survayapp-6a6a1",
  storageBucket: "survayapp-6a6a1.appspot.com",
  messagingSenderId: "314061602283",
  appId: "1:314061602283:web:0600fe45e604d951ccadae"
};

const app = initializeApp(firebaseConfig);
const firestore = getFireStore(app);