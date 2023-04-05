import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc, collectionGroup  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { calculations } from '../js/calculator.js'

const db = getFirestore(app) 
let voltioId 
let installer
let sumOfAdders
let solarPanelLocation
let roofConditionData
let data = []  
let addersData = []
let projectRedline
let mpu
let inputBox = document.getElementById('searchLeadInput')
let searchLeadViewSection = document.querySelectorAll('.searchLeadViewSection')
let clearInputsElement = document.querySelectorAll('.clearInputs')
let customerNameOnTop = document.getElementById('customerNameOnTop')
let panelLocationClass = document.querySelectorAll('.panelLocationClass');

let projectUsage = document.getElementById('projectUsage');
let totalYearlyPayment = document.getElementById('totalYearlyPayment');
let designArea = document.getElementById('designArea');
let proyectInstaller = document.getElementById('proyectInstaller');
let projectPanelsNumber = document.getElementById('projectPanelsNumber');
let projectAddOnSystem = document.getElementById('projectAddOnSystem');
let ProjectCustomerCashBack = document.getElementById('ProjectCustomerCashBack');
let projectCmsModInput = document.getElementById('projectCmsMod')
let roofCondition = document.getElementById('roofCondition');

let projectCmsModLabel = document.getElementById('projectCmsModLabel')
let projectMPU = document.getElementById('projectMPU')
let saveCurrentProjectButton =document.getElementById('saveCurrentProjectButton');

let viewProjectsButton = document.getElementById('viewProjectsButton');
let navTabUtility = document.getElementById('navTabUtility');
let navTabDesign = document.getElementById('navTabDesign');
let navTabPricing = document.getElementById('navTabPricing');
let navTabDetails = document.getElementById('navTabDetails');

let navTabUtilityContainer = document.getElementById('navTabUtilityContainer');
let navTabDesignContainer = document.getElementById('navTabDesignContainer');
let navTabPricingContainer = document.getElementById('navTabPricingContainer');
let navTabDetailsContainer = document.getElementById('navTabDetailsContainer');
viewProjectsButton.dataset.status = 'Project'
let navProposalsMenu = document.getElementById('navProposalsMenu');
let proposalViewsAccordionItem = document.getElementById('proposalViewsAccordionItem');

navProposalsMenu.addEventListener('click', function (e) {
  console.log(e.target.id);
  if(e.target.id === 'navTabUtility'){
    navTabUtilityContainer.style.display = 'block'
    navTabDesignContainer.style.display = 'none'
    navTabPricingContainer.style.display = 'none'
    navTabDetailsContainer.style.display = 'none'
    navTabUtility.classList.add('active')
    navTabDesign.classList.remove('active')
    navTabPricing.classList.remove('active')
    navTabDetails.classList.remove('active')
  }
  if(e.target.id === 'navTabDesign'){
    navTabUtilityContainer.style.display = 'none'
    navTabDesignContainer.style.display = 'block'
    navTabPricingContainer.style.display = 'none'
    navTabDetailsContainer.style.display = 'none'
    navTabUtility.classList.remove('active')
    navTabDesign.classList.add('active')
    navTabPricing.classList.remove('active')
    navTabDetails.classList.remove('active')
  }
  if(e.target.id === 'navTabPricing'){
    navTabUtilityContainer.style.display = 'none'
    navTabDesignContainer.style.display = 'none'
    navTabPricingContainer.style.display = 'block'
    navTabDetailsContainer.style.display = 'none'
    navTabUtility.classList.remove('active')
    navTabDesign.classList.remove('active')
    navTabPricing.classList.add('active')
    navTabDetails.classList.remove('active')
  }
  if(e.target.id === 'navTabDetails'){
    navTabUtilityContainer.style.display = 'none'
    navTabDesignContainer.style.display = 'none'
    navTabPricingContainer.style.display = 'none'
    navTabDetailsContainer.style.display = 'block'
    navTabUtility.classList.remove('active')
    navTabDesign.classList.remove('active')
    navTabPricing.classList.remove('active')
    navTabDetails.classList.add('active')
  }
});

onAuthStateChanged(auth, async(user) => {
    if(user){

      viewProjectsButton.addEventListener('click', (e) => {
        if(viewProjectsButton.dataset.status === 'Project'){
          getLeadOrProjectData('Project')
          viewProjectsButton.dataset.status = 'lead'
          viewProjectsButton.innerHTML = 'VIEW LEADS'
          inputBox.value = ''
        } else {
          viewProjectsButton.dataset.status = 'Project'
          getLeadOrProjectData('lead')
          viewProjectsButton.innerHTML = 'VIEW PROJECTS'
          inputBox.value = ''
        }
        
      })

      getLeadOrProjectData('lead')

      async function getLeadOrProjectData(status){
        data = [] 
          const projectInfo = query(collection(db, 'leadData'), where('status', '==', status));
          const querySnapshoot = await getDocs(projectInfo)


          const allData = querySnapshoot.forEach( async(doc) => {
              data.push([
                  doc.data().voltioIdKey,
                  doc.data().customerName,
                  doc.data().progress,
                  doc.data().status,
                  doc.data().projectStatus,
                  
              ])
          })
          console.log(data);  
          searchLeadByInput()
      }

      searchLeadViewSection.forEach( (e) => { 
        // se ejecuta despues de dar click al boton .searchLeadViewSection para que refresque la info en caso de algun cambio
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
                doc.data().progress,
                doc.data().status,
                doc.data().projectStatus,
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
    console.log(resultsArray);
    resultsArray.forEach(function(r){
      let tr = template.cloneNode(true)
      let leadId = tr.querySelector(".leadId");
      let leadProgress = tr.querySelector(".leadProgress");
      let leadStage = tr.querySelector(".leadStage");
      let editButton = tr.querySelector(".editLeadButton"); // BUTTON THAT CONTAINS CUSTOMER NAME
      let leadSetter = tr.querySelector('leadSetter');
      let leadSistemSize = tr.querySelector('leadSistemSize');
      let leadCreatedDate = tr.querySelector('leadCreatedDate');
      
      leadId.textContent = r[0]
      editButton.textContent = r[1]
      leadProgress.textContent = r[2]
      leadStage.textContent = r[4]
      
      editButton.dataset.leadVoltioId = r[0]; 
      
      searchResultsBox.appendChild(tr)
      
    })

    let viewProfileButton = document.querySelectorAll('.editLeadButton')

  /* USAR ESTA FUNCION AL CAMBIAR EL ESTATUS A PROJECTO 
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
*/
  viewProfileButton.forEach( btn => {
    btn.addEventListener('click', async (e) => {
        voltioId = e.target.dataset.leadVoltioId
        setDataToProfileView(voltioId) 
    })
  })

  
}

projectAddOnSystem.addEventListener('change', function (e) {
  calculations()
});

let docId

async function setDataToProfileView(voltioId){
    document.getElementById('titleOfEditLeadView').innerHTML = 'Lead'
    document.getElementById('searchProjectSection').style.display = 'none'
    document.getElementById('profileViewSection').style.display = 'block'
    let progressBar = document.getElementById('progressBar')
    const projectInfo = query(collection(db, 'leadData'), where('voltioIdKey', '==', voltioId));
        const querySnapshoot = await getDocs(projectInfo)
        const allData = querySnapshoot.forEach( async(doc) => {
            customerNameOnTop.innerHTML = doc.data().customerName.toUpperCase()
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
      const posIndex = cons.indexOf(docSnap.data().progress)
      console.log(posIndex);
      const value = progressValues[posIndex][1]
      console.log(value);
      progressBar.style.width = value
      getComments()
      getDataFromProjectDetails()
    } else {
      // doc.data() will be undefined in this case
     console.log("No such document!");
    }
        
}

projectPanelsNumber.addEventListener('blur', function (e) {
  calculations()
});

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

projectCmsModInput.addEventListener('change', (e) => {
  projectCmsModLabel.innerHTML = 'CMS MOD ' + projectCmsModInput.value + '%'
})

projectMPU.addEventListener('change', () => {
  console.log('mpu change');
  if(projectMPU.value === 'YES'){
    document.getElementById('projectMPUPrice').value = 3000
  } else {
    document.getElementById('projectMPUPrice').value = 0
  }
  
  
})

designArea.addEventListener('change', async function (e) {
  designAreaOnChange()
});

proyectInstaller.addEventListener('change', function (e) {
  installer = e.target.value
  getAddersByInstaller()
  
});

async function getAddersByInstaller(){
  const docRef = doc(db, "installerList", installer);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    projectRedline = docSnap.data().installerRedline
    mpu = docSnap.data().epcMPU
    let addersArray = []
    let addersList = docSnap.data().adders
    addersList.forEach(function(item) {
      console.log(item);
      let adderNameData = item.adderNameData
      let qtyData = item.qtyData
      addersArray.push([adderNameData, qtyData])
    })
      console.log(addersArray);
      addNewAdderRow(addersArray)
      setRedlineAndMPU()
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

// function to create new adder row
function addNewAdderRow(adderNameData, qtyData){
  let mainContainer = document.getElementById("addersContainers")
  mainContainer.innerHTML = ''
  let addersTitleContainer = document.createElement("tr");
  
   let adderTableRow = document.createElement("tr");
   let adderNameTableData = document.createElement("td");
   let valueTableData = document.createElement("td");
   let valueInput = document.createElement("input");
   let valueInputAdderName = document.createElement("select");
   let emptyOption = document.createElement('option');
   
   valueTableData.className = "bg-transparent text-light border-info"
   valueInput.className = "form-control bg-transparent text-light border-info sumOfAdders"
   adderTableRow.className = "bg-transparent text-light border-info table-row"
   adderNameTableData.className = "bg-transparent text-light border-info"
   valueInput.type = "number"
   valueInput.name = "qty"
   valueInput.value = !qtyData ? 0 : qtyData
   emptyOption.innerHTML = ''
   valueInputAdderName.className = "form-select bg-dark shadow text-light border-info text-start stateNameDropdown"
   valueInputAdderName.name = "adderName"
   valueInputAdderName.value = !adderNameData ? '' : adderNameData

   mainContainer.append(adderTableRow)
   adderTableRow.appendChild(adderNameTableData)
   adderTableRow.appendChild(valueTableData)
   // adderTableRow.appendChild(deleteButton)
   // valueTableData.appendChild(valueInput)
   adderNameTableData.appendChild(valueInputAdderName)
   valueInputAdderName.append(emptyOption)

   adderNameData.forEach(function(item) {
    let option = document.createElement('option');
    valueInputAdderName.append(option)    
    option.innerHTML = item[0] 
    option.label = item[0] 
    option.value = parseFloat(item[1])+','+item[0]
    
   });

    let stateNameDropdown = document.querySelectorAll('.stateNameDropdown');
    stateNameDropdown.forEach(function(item) {
      item.addEventListener('change', function (e) {
        console.log('change');
        console.log();
        let value = e.target.value
        let name = value.split(',')
        let newName = name[1]
        let newValue = name[0]
        if(!newName){
          return
        } else {
          createAdderButton(newName, newValue)
          
        }
       
      });
    });
    
}

function sumOfAddersfunction(){
  var arr = document.querySelectorAll('.qtyButton');
  var tot=0;
  arr.forEach(function(item) {
    console.log(item.dataset.value);
    tot += parseInt(item.dataset.value);
  });

  sumOfAdders = tot
  let totalAdders = document.getElementById('totalAdders');
  totalAdders.value = sumOfAdders
  totalAdders.innerHTML = sumOfAdders.toLocaleString('en-US', {style: 'currency', currency: 'USD',})
  console.log('total: '+ sumOfAdders);
  calculations(tot) 
}

function createAdderButton(newName, newValue){
  
  let addersBadgeContainer = document.getElementById('addersBadgeContainer');
  let btnAdderContainer = document.createElement('btn');
  btnAdderContainer.className = 'btn btn-outline-info position-relative qtyButton p-2 m-2'
  btnAdderContainer.type = 'button'
  btnAdderContainer.innerHTML = newName
  btnAdderContainer.dataset.value = parseFloat(newValue)
  btnAdderContainer.dataset.name = newName
  addersBadgeContainer.append(btnAdderContainer)
  sumOfAddersfunction()
  removeButton()
  
}

function removeButton(){
  let buttonAdderName = document.querySelectorAll('.qtyButton');
  buttonAdderName.forEach(function(item) {
    item.addEventListener('click', function (e) {
      e.target.remove();
      sumOfAddersfunction()
    });
    
  });
}

ProjectCustomerCashBack.addEventListener('blur', function (e) {
  sumOfAddersfunction()
  console.log(document.getElementById('ProjectCustomerCashBack').value);
});

panelLocationClass.forEach(function(item) {
  item.addEventListener('click', function (e) {
    // body
    console.log(item);
    panelLocationClass.forEach((e)=>{ e.classList.remove('border-info')})
    e.target.classList.toggle('border-info')
    solarPanelLocation = e.target.id
    
  });
});

function setRedlineAndMPU(){
  document.getElementById('projectRedline').value = projectRedline
  document.getElementById('projectMPUPrice').value = mpu
  console.log('redline: ' + projectRedline);
  console.log('mpu: ' + mpu);
  calculations()
}

// SAVE PROJECT
function getAddersDataToSaveOnDataBase(){
  let addersDataButtons = document.querySelectorAll('.qtyButton');
  addersDataButtons.forEach(function(item) {
    let newValue = item.dataset.value
    let newName = item.dataset.name
    addersData.push([newName, newValue])
    
  });
  
}

proposalViewsAccordionItem.addEventListener('blur', function (e) {
  if(e.target.id = projectUsage.id){console.log('projectUsage xxxxxxxxxx');}
});

saveCurrentProjectButton.addEventListener('click', async function (e) {
  console.log(projectUsage.value)
  console.log(totalYearlyPayment.value)
  console.log(designArea.value)
  console.log(proyectInstaller.value)
  console.log(projectPanelsNumber.value)
  console.log(projectAddOnSystem.value)
  console.log(ProjectCustomerCashBack.value)
  console.log(projectCmsModInput.value);
  console.log(solarPanelLocation)
  console.log(roofCondition.value)
  console.log(roofingMaterial.value)
  console.log(projectElectricPanelBrand.value)
  getAddersDataToSaveOnDataBase()
  console.log(addersData);
  let addersDataBd = [] 
  addersData.forEach(function(item) {
    let rowData = {}
    rowData.qtyData = parseFloat(item[0])
    rowData.adderNameData = item[1]
    addersDataBd.push(rowData)
  });
  await setDoc(doc(db, "projectDetails", voltioId), {
    projectUsage: projectUsage.value,
    totalYearlyPayment: totalYearlyPayment.value,
    designArea: designArea.value,
    proyectInstaller: proyectInstaller.value,
    projectPanelsNumber: projectPanelsNumber.value,
    projectAddOnSystem: projectAddOnSystem.value,
    ProjectCustomerCashBack: ProjectCustomerCashBack.value,
    projectCmsModInput: projectCmsModInput.value,
    solarPanelLocation: solarPanelLocation,
    roofCondition: roofCondition.value,
    roofingMaterial: roofingMaterial.value,
    projectElectricPanelBrand: projectElectricPanelBrand.value,
    addersData: addersDataBd,
  });

});

let formControl = document.querySelectorAll('.form-control');
formControl.forEach(function(item) {
  console.log(item.id);
  item.addEventListener('focus', function (e) {
    console.log(e.target);
    e.target.classList.add('border-info')
  });
  item.addEventListener('blur', function (e) {
    console.log(e.target);
    e.target.classList.remove('border-info')
  });
});

function getDataFromProjectDetails(){
  const docsRef = collection(db, 'projectDetails');
  const docRef = doc(docsRef, voltioId);

  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const dataArray = Object.keys(data).map((key) => data[key]);
        setProjectDetailsToForm(data)
      } else {
        console.log("No existe ningún documento con ese ID");
      }
    })
    .catch((error) => {
      console.log("Error al obtener el documento:", error);
    });
}

function setProjectDetailsToForm(data){
  console.log(data);
  projectUsage.value = data.projectUsage
  totalYearlyPayment.value = data.totalYearlyPayment
  designArea.value = data.designArea
  
  projectPanelsNumber.value = data.projectPanelsNumber
  projectAddOnSystem.value = data.projectAddOnSystem
  ProjectCustomerCashBack.value = data.ProjectCustomerCashBack
  projectCmsModInput.value = data.projectCmsModInput
  solarPanelLocation = data.solarPanelLocation
  roofCondition.value = data.roofCondition
  roofingMaterial.value = data.roofingMaterial
  projectElectricPanelBrand.value = data.projectElectricPanelBrand
  //designAreaOnChange(data.designArea)
  designAreaOnChangeWithPromise(data.designArea, data.proyectInstaller)
  // proyectInstaller.value = data.proyectInstaller
  // addersDataBd = addersData
}

async function designAreaOnChangeWithPromise(designArea, installer) {
  return new Promise((resolve) => {
    designAreaOnChange(designArea, installer);
    resolve();
  }).then(() => {
    console.log(installer);
    proyectInstaller
    .innerHTML = installer;
    console.log(proyectInstaller);
    calculations()
  });
}

async function designAreaOnChange(region){
  console.log('change design area');
  const docRef = doc(db, "coverageArea", region);
  const docSnap = await getDoc(docRef);
  let proyectInstaller = document.getElementById('proyectInstaller');
  proyectInstaller.innerHTML = ''
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    let installers = docSnap.data().installer
    let emptyOption = document.createElement('option');
    emptyOption.innerHTML = ''
    proyectInstaller.append(emptyOption)
    installers.forEach(function(item) {
      let option = document.createElement('option');
      option.innerHTML = item
      option.value = item
      proyectInstaller.append(option)
    });


  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

function subirImagenACarpetaDrive(imagen, carpetaId, accessToken) {
  var archivo = imagen.files[0];
  var metadata = {
    'name': archivo.name,
    'parents': [carpetaId]
  };
  var formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
  formData.append('file', archivo);
  
  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Archivo subido: ' + data.name);
  })
  .catch(error => {
    console.error('Error al subir el archivo: ' + error);
  });
}

/*testing git hub*/
/*
<button type="button" class="btn btn-primary position-relative"> ........................................................ btnAdderName
</button>
*/