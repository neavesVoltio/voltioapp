import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';


const db = getFirestore(app) 
let data = []  
let inputBox = document.getElementById('searchLeadInput')
let voltioId 

console.log('access to search leads'); 
onAuthStateChanged(auth, async(user) => {
    if(user){
        const projectInfo = query(collection(db, 'leadData'), where('status', '==', 'Project'));
        const querySnapshoot = await getDocs(projectInfo)
        const allData = querySnapshoot.forEach( async(doc) => {
            data.push([
                doc.data().voltioIdKey,
                doc.data().customerName,
                doc.data().customerPhoneNumber,
                doc.data().status,
            ])
        })

        searchLeadByInput()

    } else {
        console.log('no user logged');
    }
})

console.log(data);

inputBox.addEventListener('input', () => {
  searchLeadByInput()})

  function searchLeadByInput(){
  
    let searchInput = document.getElementById("searchLeadInput").value.toString().toLowerCase().trim()
    let searchWords = searchInput.split(/\w^/)
  
    let resultsArray = searchInput === "" ? data : data.filter(function(r){
      return searchWords.every(function(word){
        return [1].some(function(colIndex){
          return r[colIndex].toString().toLowerCase().indexOf(word) !== -1
        })
      })
  })
  
    let searchResultsBox = document.getElementById("searchResults")
    let templateBox = document.getElementById("rowTemplate")
    let template = templateBox.content
  
    searchResultsBox.innerHTML = ""
  
    resultsArray.forEach(function(r){
      let tr = template.cloneNode(true)
      let leadName = tr.querySelector(".leadName");
      let leadEmail = tr.querySelector(".leadEmail");
      let leadPhone = tr.querySelector(".leadPhone");
      var editButton = tr.querySelector(".editLeadButton");
      var editButtonIcon = tr.querySelector(".editLeadButtonIcon");
      var statusButton = tr.querySelector(".status-button");
      var beforeStatusButton = tr.querySelector(".before-status-button")
  
      leadName.textContent = r[1]
      leadEmail.textContent = r[2]
      leadPhone.textContent = r[18]
      
      editButton.dataset.leadVoltioId = r[0]; // instead of email, change to voltio id
      editButtonIcon.dataset.leadVoltioId = r[0]; // instead of email, change to voltio id
      statusButton.dataset.voltioId = r[0]
      statusButton.setAttribute("data-bs-toggle", "modal");
      statusButton.setAttribute("data-bs-target", "#leadProfile");
  
      beforeStatusButton.classList.add("btn-outline-success")
      beforeStatusButton.textContent = r[3]
  
      searchResultsBox.appendChild(tr)
      
    })

  let beforeStatusButtonChange = document.querySelectorAll('.before-status-button')
  let statusButtonChange = document.querySelectorAll('.status-button')
  let viewProfileButton = document.querySelectorAll('.editLeadButton')

  beforeStatusButtonChange.forEach( btn => {
    btn.addEventListener('click', async(btn) =>{
        if(btn.target.dataset.buttonState === "status"){
          btn.target.previousElementSibling.classList.remove("d-none");
          btn.target.textContent = "Cancel";
          btn.target.dataset.buttonState = "cancel";
        } else {
          if(btn.target.classList[3] === "btn-outline-danger"){
            btn.target.previousElementSibling.classList.add("d-none");
            btn.target.textContent = "Customer";
            btn.target.dataset.buttonState = "status";
          } else{
            btn.target.previousElementSibling.classList.add("d-none");
            btn.target.textContent = "Project";
            btn.target.dataset.buttonState = "status";
          }
          
        }
      })
  })

  statusButtonChange.forEach( btn => {
    btn.addEventListener('click', async (e) => {
      // document.getElementById("app").innerHTML='<object type="text/html" data="../views/leadProfile.html" width="100%" height="100%" ></object>';
      voltioId = e.target.dataset.voltioId
             const voltioIds = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId))
                const voltioIdsSnapshot = await getDocs(voltioIds)
                voltioIdsSnapshot.forEach( async(e) => {
                  const docRef = doc(db, 'leadData', e.id)
                  await updateDoc(docRef, {
                    status: 'lead',
                    projectDate: new Date()
                  })
                })
                
      e.target.closest(".result-box").remove();
    })
  })

  viewProfileButton.forEach( btn => {
    btn.addEventListener('click', async (e) => {
        console.log(e.target.dataset.leadVoltioId);
        voltioId = e.target.dataset.leadVoltioId
        setDataToProfileView(voltioId) 
    })
  })

  
}

let docId
async function setDataToProfileView(voltioId){
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


let editLeadButtonToServer = document.getElementById('editLeadButtonToServer')

editLeadButtonToServer.addEventListener('click', async (e) => {
    const docRef = doc(db, 'leadData', docId)
                  await updateDoc(docRef, {
                    customerName: document.getElementById('leadName').value,
                    customerPhoneNumber: document.getElementById('leadPhone').value,
                    customerAddress: document.getElementById('leadAddress').value,
                    customerLanguage: document.getElementById('leadLanguage').value,
                    inputCity: document.getElementById('leadCity').value,
                    inputState: document.getElementById('stateDropdown').value,
                    inputZip: document.getElementById('leadZip').value,
                    customerEmail: document.getElementById('leadEmail').value,
                  }).then( () => {
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
})
  