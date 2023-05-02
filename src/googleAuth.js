import { GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth, app } from './firebase/config.js'
import { getFirestore, doc, setDoc, query, where, collection, getDocs, addDoc  } from './firebase/firebaseJs.js'
import { onAuthStateChanged, updateProfile } from './firebase/firebaseAuth.js';
const db = getFirestore(app) 

const googleButton = document.querySelector('#my-signin2')

googleButton.addEventListener('click', async () => {
    
    const provider = new GoogleAuthProvider()
    try{
      const credentials = await signInWithPopup(auth, provider)
      onAuthStateChanged(auth, async(user) => {
        if(user){
            let name = user.displayName;
            let userId = user.uid
            let email = user.email
            
        } else{
            console.log('no user logged xxx');
            document.getElementById('navbar').style.display = 'none'
            document.getElementById('navbar').style.display = 'none'
            document.getElementById('navbar-container').style.display = 'none'
            document.getElementById('sidebar').style.display = 'none'
            let userLogged = document.querySelectorAll('.userLogged')
            userLogged.forEach( btn => {
                btn.style.display = 'none'
            })

            document.getElementById("app").innerHTML='<object type="text/html" data="views/login.html" width="100%" height="100%" ></object>';
        }   
    })

    } catch (error){
        console.log(error)
    }
    
}) 

