import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
const db = getFirestore(app) 

let saveLeadButton = document.querySelector('#updateProfileButton')

let leadData
let addNewLeadViewSection =document.querySelectorAll('.addNewLeadViewSection')        

addNewLeadViewSection.forEach((e) =>{
 e.addEventListener('click', (b) => {
    document.querySelector('#addNewLeadSection').style.display = 'block'
    document.querySelector('#searchProjectSection').style.display = 'none'
    document.querySelector('#profileViewSection').style.display = 'none'

 })   
})

saveLeadButton.addEventListener('click', (e) =>{

    let customerLanguage = document.getElementById('customerLanguage').value
    let customerPhoneNumber = document.getElementById('customerPhoneNumber').value
    let customerAddress= document.getElementById('customerAddress').value
    let inputCity= document.getElementById('inputCity').value
    let inputState= document.getElementById('inputState').value
    let customerName= document.getElementById('customerName').value
    let inputZip= document.getElementById('inputZip').value
    let customerNotes=  document.getElementById('customerNotes').value
    let profileBirth= document.getElementById('profileBirth').value



    if(!customerName || !customerAddress || !inputCity || !inputZip || inputState.value === '' ){
        let required = document.querySelectorAll('.required')
        required.forEach((e) => {
            if(e.value != ''){
                e.classList.remove('border-danger')    
            } else {
                e.classList.add('border-danger')    
            }
            
        })
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Please enter requiered info',
            showConfirmButton: false,
            timer: 1500
          })
          return
    } else {
        onAuthStateChanged(auth, async(user) => {
            if(user){
                let rep = user.uid
                let voltioId = []         
                const voltioIds = query(collection(db, 'voltioId'))
                const voltioIdsSnapshot = await getDocs(voltioIds)
                voltioIdsSnapshot.forEach((e) => {
                    voltioId.push(e.data().voltioId)
                })
                
                let newVoltioId = Math.max(...voltioId) + 1
                console.log(newVoltioId);
                
                await addDoc(collection(db, 'leadData'), {
                    customerLanguage: customerLanguage.toUpperCase() ,
                    customerPhoneNumber: customerPhoneNumber.toUpperCase(),
                    customerAddress: customerAddress.toUpperCase(),
                    inputCity: inputCity.toUpperCase(),
                    inputState: inputState.toUpperCase(),
                    customerName: customerName.toUpperCase(),
                    inputZip: inputZip,
                    customerNotes: customerNotes,
                    profileBirth: profileBirth,
                    repName: rep,
                    voltioIdKey: 'V-'+newVoltioId,
                    status: 'lead',
                    creationDate: new Date()
                }).then( async() => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Congrats, lead has been saved',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      await addDoc(collection(db, 'voltioId'), {
                        voltioId: newVoltioId,
                      })
                      setDataToProfileView('V-'+newVoltioId)
                    document.querySelector('#addNewLeadSection').style.display = 'none'
                    document.querySelector('#searchProjectSection').style.display = 'none'
                    document.querySelector('#profileViewSection').style.display = 'block'
                    
                    document.getElementById('customerName').value = ''
                    document.getElementById('customerPhoneNumber').value = ''
                    document.getElementById('customerAddress').value = ''
                    document.getElementById('inputCity').value = ''
                    document.getElementById('inputState').value = ''
                    document.getElementById('inputZip').value = ''
                    document.getElementById('customerNotes').value = ''
                    document.getElementById('profileBirth').value = ''
                    
                }).catch((error) => {
                    console.log(error);
                })
            } else {
                console.log('no user logged');
            }
        })
    }
    
})

let docId

async function setDataToProfileView(voltioId){
    document.getElementById('titleOfEditLeadView').innerHTML = 'Lead'
    document.getElementById('searchProjectSection').style.display = 'none'
    document.getElementById('profileViewSection').style.display = 'block'
    const projectInfo = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId));
        const querySnapshoot = await getDocs(projectInfo)
        const allData = querySnapshoot.forEach( async(doc) => {
            document.getElementById('leadVoltioId').value = doc.data().voltioIdKey.toUpperCase()
            document.getElementById('leadName').value = doc.data().customerName.toUpperCase()
            document.getElementById('leadPhone').value = doc.data().customerPhoneNumber
            document.getElementById('leadAddress').value = doc.data().customerAddress.toUpperCase()
            document.getElementById('leadLanguage').value = doc.data().customerLanguage.toUpperCase()
            document.getElementById('leadCity').value = doc.data().inputCity.toUpperCase()
            document.getElementById('stateDropdown').value = doc.data().inputState.toUpperCase()
            document.getElementById('leadZip').value = doc.data().inputZip
            document.getElementById('leadEmail').value = doc.data().customerEmail
            docId = doc.id
        })
    
    const docRef = doc(db, "leadStatus", voltioId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      document.getElementById('proposalStatus').value = docSnap.data().proposalStatus
      document.getElementById('projectType').value = docSnap.data().projectType
      document.getElementById('status').value = docSnap.data().status
      document.getElementById('progress').value = docSnap.data().progress
      document.getElementById('apptDate').value = docSnap.data().apptDate
      document.getElementById('creditStatus').value = docSnap.data().creditStatus
      document.getElementById('ss').value = docSnap.data().ss
      document.getElementById('docs').value = docSnap.data().docs
    } else {
      // doc.data() will be undefined in this case
     console.log("No such document!");
    }
        
}