import { getStorage , ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } 
from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
const db = getFirestore(app) 

let accordionFlushExample = document.getElementById('accordionFlushExample')

onAuthStateChanged(auth, async(user) => {
    if(user){
        let name = user.displayName;
        let userId = user.uid
        accordionFlushExample.addEventListener('click', (e) => {
            if(e.target.matches('#saveCustomerCommentButton')){
                let textBox = document.getElementById("customerComment").value
                let commentsBd = 'listOfCommentsCustomer'
                let box = 'customerComment'
                addCustomerCommentButton(textBox, commentsBd, box)
            }
            if(e.target.matches('#saveAdminCommentButton')){
                let textBox = document.getElementById("adminComment").value
                let commentsBd = 'listOfCommentsAdmin'
                let box = 'adminComment'
                addCustomerCommentButton(textBox, commentsBd, box)
            }
            if(e.target.matches('#saveInternalNotesButton')){
                let textBox = document.getElementById("internalNotes").value
                let commentsBd = 'listOfInternalNotes'
                let box = 'internalNotes'
                addCustomerCommentButton(textBox, commentsBd, box)
            }
            if(e.target.matches('#saveleadNotesButton')){
                let textBox = document.getElementById("leadNotes").value
                let commentsBd = 'listOfleadNotes'
                let box = 'leadNotes'
                addCustomerCommentButton(textBox, commentsBd, box)
            }
        })
        
        accordionFlushExample.addEventListener('click', (e) => {
            if(e.target.matches('#refreshCustomerCommentButton')){ //
                let textBox = document.getElementById("customerComment").value
                let commentsBd = 'listOfCommentsCustomer'
                createCustomerCommentsList(textBox, commentsBd)
            }
            if(e.target.matches('#refreshAdminCommentButton')){
                let textBox = document.getElementById("adminComment").value
                let commentsBd = 'listOfCommentsAdmin'
                createCustomerCommentsList(textBox, commentsBd)
            }
            if(e.target.matches('#refreshInternalNotesButton')){
                let textBox = document.getElementById("internalNotes").value
                let commentsBd = 'listOfInternalNotes'
                createCustomerCommentsList(textBox, commentsBd)
            }
            if(e.target.matches('#refreshleadNotesButton')){
                let textBox = document.getElementById("leadNotes").value
                let commentsBd = 'listOfleadNotes'
                createCustomerCommentsList(textBox, commentsBd)
            }
        })

        async function addCustomerCommentButton(textBox, commentsBd, box){
            
            let voltioId = document.getElementById("leadVoltioId").value
            console.log(voltioId);
            // Date function 
            let date = new Date()
            let months = ["ENE", "FEB", "MAR", 'ABR', "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
            let year = date.getFullYear()
            let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            let currentMonth = months[date.getMonth()]
            let currentDate = year + ' / '+ currentMonth + ' / ' + day + ' ' + hour + ':' + minutes
            if(textBox != ""){
                await addDoc(collection(db, commentsBd), {
                    voltioId: voltioId,
                    customerComment: textBox,
                    date: currentDate,
                    userName: name,
                    userId: user.uid
                }).then( async() => {
                    createCustomerCommentsList(textBox, commentsBd)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Note created',
                        showConfirmButton: false,
                        timer: 1500
                    })
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

                document.getElementById(box).value = ""
            
            } else{
            return
            }
        }

        async function createCustomerCommentsList(textBox, commentsBd){
            let voltioId = document.getElementById("leadVoltioId").value
            let dataNotes = []
            const voltioIds = query(collection(db, commentsBd), where('voltioId', '==', voltioId), orderBy("date", 'desc'))
                const voltioIdsSnapshot = await getDocs(voltioIds)
                voltioIdsSnapshot.forEach((e) => {
                    dataNotes.push([e.data().customerComment, e.data().date, e.data().userName])
                })

            document.getElementById(commentsBd).innerHTML = ""
            let mainDiv = document.getElementById(commentsBd)
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


    } else {
        console.log('no user logged');
    }
})
