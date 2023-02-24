import { getStorage , ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } 
from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
const db = getFirestore(app) 

onAuthStateChanged(auth, async(user) => {
    if(user){
        let statusSection = document.getElementById('statusSection')
        statusSection.addEventListener('change', (e) => {
            if(e.target.matches('#proposalStatus')){
                saveStatusToServer()
            }
            if(e.target.matches('#projectType')){
                saveStatusToServer()
            }
            if(e.target.matches('#status')){
                saveStatusToServer()
            }
            if(e.target.matches('#progress')){
                saveStatusToServer()
            }
            if(e.target.matches('#creditStatus')){
                saveStatusToServer()
            }
            if(e.target.matches('#apptDate')){
                saveStatusToServer()
            }
            if(e.target.matches('#ss')){

                saveStatusToServer()
            }
            if(e.target.matches('#docs')){
                saveStatusToServer()
            }
        })
        
    }else{
        console.log('no user logged');
    }
})

async function saveStatusToServer(){
    let voltioId = document.getElementById('leadVoltioId').value
        let proposalStatus = document.getElementById('proposalStatus').value
        let projectType = document.getElementById('projectType').value
        let status = document.getElementById('status').value
        let progress = document.getElementById('progress').value
        let apptDate = document.getElementById('apptDate').value
        let creditStatus = document.getElementById('creditStatus').value
        let ss = document.getElementById('ss').value
        let docs = document.getElementById('docs').value
    await setDoc(doc(db, "leadStatus", voltioId), {
        proposalStatus: proposalStatus,
        projectType: projectType,
        status: status,
        progress: progress,
        apptDate: apptDate,
        creditStatus: creditStatus,
        ss: ss,
        docs: docs,
    }).then( async() => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Note created',
            showConfirmButton: false,
            timer: 1500
        })
        let progressBar = document.getElementById('progressBar')
        progressBar.innerHTML = progress
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
      ['Expecting MP1', '30%'],
      ['MP1 Paid', '33%'],
      ['Design and Permits', '34%'],
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
      ['MPU scheduled', '63%'],
      ['MPU installed', '66%'],
      ['Expecting MP2', '69%'],
      ['MP2 Paid', '72%'],
      ['Pending Final Inspection', '75%'],
      ['Final inspection scheduled', '78%'],
      ['Final inspection completed', '81%'],
      ['Corrections needed', '84%'],
      ['Submitted for PTO', '87%'],
      ['PTO In Progress', '90%'],
      ['Pending Utility Company', '90%'],
      ['System activated', '93%'],
      ['Final Documents', '95%'],
      ['Job completed', '100%']]
      let cons = progressValues.map( r => r[0])
      console.log(cons);
      const posIndex = cons.indexOf(progress)
      console.log(posIndex);
      const value = progressValues[posIndex][1]
      console.log(value);
      progressBar.style.width = value
    }).catch((error) => {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'An error has occurred, please try again. ' + error,
            showConfirmButton: false,
            timer: 1500
          })
          return
    })   
}