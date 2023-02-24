import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from '../firebase/config.js'
import { app } from '../firebase/config.js'

onAuthStateChanged(auth, async(user) => {
    if(user){
       
        document.getElementById("app").innerHTML='<object type="text/html" data="src/views/dashboard.html" width="100%" height="100%" ></object>';
        document.getElementById('usernameOnMenu').innerHTML = 'Welcome ' + user.displayName
        document.getElementById('navbar').style.display = 'block'
        document.getElementById('navbar-container').style.display = 'block'
        document.getElementById('sidebar').style.display = 'block'
        let userLogged = document.querySelectorAll('.userLogged')
        userLogged.forEach( btn => {
            btn.style.display = 'block'
        })
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
        document.getElementById("app").innerHTML='<object type="text/html" data="src/views/login.html" width="100%" height="100%" ></object>';
    }
})

