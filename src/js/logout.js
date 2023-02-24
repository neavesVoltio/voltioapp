import { signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { auth } from '../firebase/config.js'

try{
    const userLoggedSub = document.getElementById('logoutButton')
    userLoggedSub.addEventListener('click', async () => {
    console.log("logout submenu clicked")
    await signOut(auth)
    
})

} catch(error){
    
}

export function logOut(){   
    console.log("logout function")
    const logoutButton = document.querySelector('.userLogged')
    
    logoutButton.addEventListener('click', async () => {
        await signOut(auth)
        window.open(webDomain + '/index.html', '_self');
    })

    
        
}