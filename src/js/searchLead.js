import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';

const db = getFirestore(app) 
let data = []  
let inputBox = document.getElementById('searchLeadInput')
let voltioId 
let searchLeadViewSection = document.querySelectorAll('.searchLeadViewSection')
let clearInputsElement = document.querySelectorAll('.clearInputs')

onAuthStateChanged(auth, async(user) => {
    if(user){
      
      const projectInfo = query(collection(db, 'leadData'), where('status', '==', 'lead'));
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
      console.log('searchleads js');
      searchLeadViewSection.forEach( (e) => {
        e.addEventListener('click', async (e) => {
          data = []  
          document.querySelector('#addNewLeadSection').style.display = 'none'
          document.querySelector('#searchProjectSection').style.display = 'block'
          document.querySelector('#profileViewSection').style.display = 'none'
          document.getElementById('imageCustomerGallery').innerHTML = ''
          document.getElementById('customerFilesUpload').value = ''
          const projectInfo = query(collection(db, 'leadData'), where('status', '==', 'lead'));
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
          
        })

      })
      
        
    } else {
        console.log('no user logged');
    }
})


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
      
      editButton.dataset.leadVoltioId = r[0]; 
      editButtonIcon.dataset.leadVoltioId = r[0]; 
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
            btn.target.textContent = "Lead";
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
                    status: 'Project',
                    projectDate: new Date()
                  })
                })
                setDataToProfileView(voltioId)          
      e.target.closest(".result-box").remove();
    })
  })

  viewProfileButton.forEach( btn => {
    btn.addEventListener('click', async (e) => {
        voltioId = e.target.dataset.leadVoltioId
        setDataToProfileView(voltioId) 
    })
  })

  
}

let docId

async function setDataToProfileView(voltioId){
    document.getElementById('titleOfEditLeadView').innerHTML = 'Lead'
    document.getElementById('searchProjectSection').style.display = 'none'
    document.getElementById('profileViewSection').style.display = 'block'
    let progressBar = document.getElementById('progressBar')

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
      document.getElementById('proposalStatus').value = docSnap.data().proposalStatus
      document.getElementById('projectType').value = docSnap.data().projectType
      document.getElementById('status').value = docSnap.data().status
      document.getElementById('progress').value = docSnap.data().progress
      progressBar.innerHTML = docSnap.data().progress
      document.getElementById('apptDate').value = docSnap.data().apptDate
      document.getElementById('creditStatus').value = docSnap.data().creditStatus
      document.getElementById('ss').value = docSnap.data().ss
      document.getElementById('docs').value = docSnap.data().docs
      let progressValues = 
      [['Missing stips', '3%'],
      ['Missing utility bill', '6%'],
      ['Site survey scheduled', '9%'],
      ['Site survey completed', '12%'],
      ['Pending site survey', '15%'],
      ['Reschedule site survey', '18%'],
      ['Plans ordered', '21%'],
      ['Waiting for NTP', '24%'],
      ['NTP completed', '27%'],
      ['Expecting MPONE', '30%'],
      ['MPONE Paid', '33%'],
      ['Design', '34%'],
      ['Engineering', '35%'],
      ['Permits', '36%'],
      ['Needs roof quote', '39%'],
      ['Resign docs', '42%'],
      ['Pending Reroof', '43%'],
      ['Reroof scheduled', '45%'],
      ['Reroof completed', '48%'],
      ['Pending PV install', '51%'],
      ['PV Install Reschedule', '52%'],
      ['PV Install scheduled', '54%'],
      ['PV Installed', '57%'],
      ['MPU pending', '60%'],
      ['MPU schedule', '63%'],
      ['MPU installed', '66%'],
      ['Expecting MPTWO', '69%'],
      ['MPTWO Paid', '72%'],
      ['Pending Final Inspection', '75%'],
      ['Final inspection scheduled', '78%'],
      ['Final inspection completed', '81%'],
      ['Corrections needed', '84%'],
      ['Submitted for PTO', '87%'],
      ['PTO approved', '90%'],
      ['System activated', '93%'],
      ['Final Documents', '95%'],
      ['Job completed', '100%']]
      let cons = progressValues.map( r => r[0])
      console.log(cons);
      const posIndex = cons.indexOf(docSnap.data().progress)
      console.log(posIndex);
      const value = progressValues[posIndex][1]
      console.log(value);
      progressBar.style.width = value
      getComments()
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

function clearInputs(){
  clearInputsElement.forEach((e) => {
    console.log(e);
    e.innerHTML = ''
  })
}

async function getComments(){
  let commentsBd = ['listOfCommentsCustomer', 'listOfCommentsAdmin', 'listOfInternalNotes', 'listOfleadNotes']
  let voltioId = document.getElementById("leadVoltioId").value
  for(var n = 0; n <=commentsBd.length -1 ; n++){
    console.log(commentsBd[n]);
    let dataNotes = []
  const voltioIds = query(collection(db, commentsBd[n]), where('voltioId', '==', voltioId), orderBy("date", 'desc'))
      const voltioIdsSnapshot = await getDocs(voltioIds)
      voltioIdsSnapshot.forEach((e) => {
          dataNotes.push([e.data().customerComment, e.data().date, e.data().userName])
      })

  document.getElementById(commentsBd[n]).innerHTML = ""
  let mainDiv = document.getElementById(commentsBd[n])
  let noteContainer = document.createElement("div")
  let userNameTitle = document.createElement("strong")
  let textOfComment = document.createElement("p")
  let dateContainer = document.createElement("div")
  let dateOfComment = document.createElement("p")
  
  for( var i=0;i <=dataNotes.length - 1; i++){
      let noteContainer = document.createElement("div")
      let userNameTitle = document.createElement("strong")
      let textOfComment = document.createElement("p")
      let dateContainer = document.createElement("div")
      let dateOfComment = document.createElement("p")    
      noteContainer.className = "row border-bottom border-info-subtle p-2"
      //noteContainer.classList.add("mb-2")
      dateContainer.classList.add("row")
      dateOfComment.classList.add("text-end")
      dateOfComment.classList.add("fs-6")
      dateOfComment.classList.add("fw-light")
      textOfComment.classList.add("text-light")
      userNameTitle.classList.add("text-light")
      dateOfComment.classList.add("text-light")
      userNameTitle.innerHTML = dataNotes[i][2]
      textOfComment.innerHTML = dataNotes[i][0]
      dateOfComment.innerHTML = dataNotes[i][1]
      mainDiv.appendChild(noteContainer)
      noteContainer.append(userNameTitle)
      noteContainer.append(textOfComment)
      noteContainer.append(dateContainer)
      dateContainer.append(dateOfComment)
  }
  }
  
}

let projectCmsModInput = document.getElementById('projectCmsMod')
let projectCmsModLabel = document.getElementById('projectCmsModLabel')

projectCmsModInput.addEventListener('change', (e) => {
  projectCmsModLabel.innerHTML = 'CMS MOD ' + projectCmsModInput.value + '%'
})

  