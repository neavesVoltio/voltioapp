import { getStorage , ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } 
from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
const db = getFirestore(app) 
console.log('stages view js ');
onAuthStateChanged(auth, async(user) => {
    if(user){
        let statusSection = document.getElementById('statusSection')
       
    }else{
        console.log('no user logged');
    }
})

