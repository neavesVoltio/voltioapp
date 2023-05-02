import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
const db = getFirestore(app) 

let updateProfileButton = document.querySelector('#updateProfileButton')

onAuthStateChanged(auth, async(user) => {
    document.getElementById('profileName').value = user.displayName
    const profileBd = query(collection(db, 'userProfile'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(profileBd);
    const allData = querySnapshot.forEach( async(doc) => {
        if(!doc){
            console.log('no first user addedd');
            await addDoc(collection(db, 'userProfile'), {
                displayName: user.displayName,
                userId: user.uid
               })
        } else {
            console.log('else');
            document.getElementById('profileName').value = user.displayName
            document.getElementById('profileRouting').value = !doc.data().profileRouting ? '' : doc.data().profileRouting
            document.getElementById('profileAccountNumber').value = !doc.data().profileAccountNumber ? '' : doc.data().profileAccountNumber
            document.getElementById('profileAddress').value = !doc.data().profileAddress ? '' : doc.data().profileAddress
            document.getElementById('inputCity').value = !doc.data().inputCity ? '' : doc.data().inputCity
            document.getElementById('inputState').value = !doc.data().inputState ? '' : doc.data().inputState
            document.getElementById('inputZip').value = !doc.data().inputZip ? '' : doc.data().inputZip
            document.getElementById('profileNotes').value = !doc.data().profileNotes ? '' : doc.data().profileNotes
            document.getElementById('profilePhone').value = !doc.data().profilePhone ? '' : doc.data().profilePhone
            document.getElementById('profileSocialPhone').value = !doc.data().profileSocialPhone ? '' : doc.data().profileSocialPhone
            document.getElementById('profileBirth').value = !doc.data().profileBirth ? '' : doc.data().profileBirth
            document.getElementById('profileFranchise').value = !doc.data().profileFranchise ? '' : doc.data().profileFranchise
            document.getElementById('profileFranchiseOwner').value = !doc.data().profileFranchiseOwner ? '' : doc.data().profileFranchiseOwner
            document.getElementById('profileTeam').value = !doc.data().profileTeam ? '' : doc.data().profileTeam
        }
    })
    let profileCountry = document.getElementById('profileCountry');
profileCountry.addEventListener('change', function (e) {
    country()
});
   function country(){
      
      if(profileCountry.value === 'USA'){
        console.log(profileCountry.value);
        document.getElementById('usaSection').style.display = 'block';
        document.getElementById('mxSection').style.display = 'none';
      } else if (profileCountry.value === 'MX') {
        document.getElementById('usaSection').style.display = 'none';
        document.getElementById('mxSection').style.display = 'block';
      }
   }
})

updateProfileButton.addEventListener('click', (e) =>{
    console.log('update profile clicked');
    onAuthStateChanged(auth, async(user) => {
        if(user){
            const users = collection(db, "userProfile");

            await setDoc(doc(users, user.email), {
                name: user.displayName,
                userId: user.uid,
            });
            let userData = []
            userData.userEmail = user.email
            userData.displayName = document.getElementById('profileName').value
            userData.profileRouting = document.getElementById('profileRouting').value
            userData.profileAccountNumber = document.getElementById('profileAccountNumber').value
            userData.profileAddress = document.getElementById('profileAddress').value
            userData.inputCity = document.getElementById('inputCity').value
            userData.inputState = document.getElementById('inputState').value
            userData.inputZip = document.getElementById('inputZip').value
            userData.profileNotes = document.getElementById('profileNotes').value
            userData.profilePhone = document.getElementById('profilePhone').value
            userData.profileSocialPhone = document.getElementById('profileSocialPhone').value
            userData.profileBirth = document.getElementById('profileBirth').value
            userData.profileFranchise = document.getElementById('profileFranchise').value
            userData.profileFranchiseOwner = document.getElementById('profileFranchiseOwner').value
            userData.profileTeam = document.getElementById('profileTeam').value
            //console.log(user.uid);
            const profileBd = query(collection(db, 'userProfile'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(profileBd);
            const allData = querySnapshot.forEach( async(doc) => {
                userData.docId = doc.id
                userData.userId = doc.data().userId
                
                updateProfileData(userData)
            })
            async function updateProfileData(userData){
                console.log(userData);
                const docRef = doc(db, 'userProfile', userData.docId)
                    await updateDoc((docRef),{
                        userEmail: userData.userEmail,
                        displayName: userData.displayName,
                        profileRouting: userData.profileRouting,
                        profileAccountNumber: userData.profileAccountNumber,
                        profileAddress: userData.profileAddress,
                        inputCity: userData.inputCity,
                        inputState: userData.inputState,
                        inputZip: userData.inputZip,
                        profileNotes: userData.profileNotes,
                        profilePhone: userData.profilePhone,
                        profileSocialPhone: userData.profileSocialPhone,
                        profileBirth: userData.profileBirth,
                        profileFranchise: userData.profileFranchise,
                        profileFranchiseOwner: userData.profileFranchiseOwner,
                        profileTeam: userData.profileTeam,
                        updated: 'done',
                    }).then( async () => {
                        const docRefRol = doc(db, "userRol", user.email);
                        const docSnapRol = await getDoc(docRefRol);

                        if (docSnapRol.exists()) {
                            return
                        } else {
                            // doc.data() will be undefined in this case
                            const usersRol = collection(db, "userRol");
                            await setDoc(doc(usersRol, user.email), {
                                name: user.email,
                                accessLevel: 'rep',
                            });
                        }
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Your data has been saved',
                            showConfirmButton: false,
                            timer: 1500
                          })
                          
                    }).catch( (error) => {
                        console.log(error);
                    })
            }
            
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
            document.getElementById("app").innerHTML='<object type="text/html" data="/src/views/login.html" width="100%" height="100%" ></object>';
        }
    })
})


  