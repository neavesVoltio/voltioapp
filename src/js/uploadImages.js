import { getStorage , ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"
import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
import { getApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
const db = getFirestore(app) 

let imagenArticulo = document.getElementById('customerFilesUpload')
let voltioIdKey = document.getElementById('leadVoltioId').value
let uploadCustomerImageButton = document.getElementById('uploadCustomerImageButton')
let getProjectImages = document.getElementById('getProjectImagesButton')
let file
let imagesRef
let imageURL
let imagesGalery = []

getProjectImages.addEventListener('click', (e) => {
    getCustomerImagesGalery()
})

imagenArticulo.addEventListener('change', (e) => {
    file = e.target.files[0]
    
})

uploadCustomerImageButton.addEventListener('click', (e) => {
    console.log(e.target.value);
    let vidFileLength = imagenArticulo.files.length; 
    if (vidFileLength === 0) {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Plase select an image before upload',
            showConfirmButton: false,
            timer: 1500
          })
          return
        } else {
        
        // Get a non-default Storage bucket
        const firebaseApp = getApp();
        const storage = getStorage(firebaseApp, "gs://voltioapp2.appspot.com/"); 
        imagesRef = ref(storage, 'images/' + document.getElementById('leadVoltioId').value +'-'+ file.name)
        console.log(imagesRef.bucket);// 'file' viene del archivo seleccionado

        uploadBytes(imagesRef, file).then((snapshot) => {
            imageURL = getDownloadURL(snapshot.ref).then(  async (downloadURL) => {
                
                await addDoc(collection(db, 'projectImages'), {
                    voltioId: document.getElementById('leadVoltioId').value,
                    uploadedImage: downloadURL,
                    date: new Date(),
                }).then( async() => {
                    getCustomerImagesGalery()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Image uploaded',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    imagenArticulo.value = ''
                }).catch((error) => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'An error has occurred, please try again.',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      return
                })

            });
            
        });    
    }
    
})


async function getCustomerImagesGalery(){
    const voltioIds = query(collection(db, 'projectImages'), where('voltioId', '==', document.getElementById('leadVoltioId').value ))
                const voltioIdsSnapshot = await getDocs(voltioIds)
                voltioIdsSnapshot.forEach((e) => {
                    imagesGalery.push([e.data().uploadedImage, e.data().voltioId])
                })
    viewCustomerImagesGalery()
  }
  
  function viewCustomerImagesGalery(){
    document.getElementById("imageCustomerGallery").innerHTML = ""
    let mainDiv = document.getElementById("imageCustomerGallery")
    
    for( var i=0;i <=imagesGalery.length - 1; i++){
      let containerImage = document.createElement("div")
      let cardImage = document.createElement("strong")
      let imageLink = document.createElement("a")
      let imageData = document.createElement("img")
  
      containerImage.classList.add("container")
      containerImage.classList.add("col-4")
      containerImage.classList.add("mb-2")
      containerImage.classList.add("border")
      containerImage.classList.add("border-info")
      containerImage.classList.add("gap-3")
  
      cardImage.classList.add("card")
  
      imageLink.href = imagesGalery[i][0]
      imageLink.target = "_blank"
  
      imageData.src = imagesGalery[i][0]
      imageData.classList.add("card-img-top")
      imageData.alt = imagesGalery[i][1]
  
      mainDiv.appendChild(containerImage)
      containerImage.append(cardImage)
      cardImage.append(imageLink)
      imageLink.append(imageData)
    }
    loadingEnd()
  }

