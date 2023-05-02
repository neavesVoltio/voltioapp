import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc, arrayUnion  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';

const db = getFirestore(app) 
let data = []  
let addFinancialSection = document.getElementById('addFinancialSection');
let addFinancialTitle = document.getElementById('addFinancialTitle'); // use it to change title when edit or add loan
let addFinancialForm = document.getElementById('addFinancialForm'); // use this let as an event listener when change inputs
let loanName = document.getElementById('loanName');
let loanRedline = document.getElementById('loanRedline');
let loanTerm = document.getElementById('loanTerm');
let loanApr = document.getElementById('loanApr');
let loanMonthly = document.getElementById('loanMonthly');
let loanNoItc = document.getElementById('loanNoItc');
let loanDealerFee = document.getElementById('loanDealerFee');
let addLoabButtonToServer = document.getElementById('addLoabButtonToServer'); // button to save data on db
let viewLoanListSection = document.getElementById('viewLoanListSection'); // section to create list of loans
let loanCardsContainer = document.getElementById('loanCardsContainer');
let loanData = {}

console.log('access to loan section');
onAuthStateChanged(auth, async(user) => {
    if(user){
        addLoabButtonToServer.addEventListener('click', (e) => {
            if(user){
                loanData = {
                    loanName: loanName.value,
                    loanRedline: loanRedline.value,
                    loanTerm: loanTerm.value,
                    loanApr: loanApr.value,
                    loanMonthly: loanMonthly.value,
                    loanNoItc: loanNoItc.value,
                    loanDealerFee: loanDealerFee.value
                  };
                  console.log(loanData);
                  if(!loanData.loanName){
                    Swal.fire({
                        icon: 'error',
                        title: 'Loan name is required',
                        text: 'Please try again',
                        confirmButtonText: 'Ok'
                      });
                  } else {
                    saveDataToFirestore()
                  }
                  
            }
        })
    } else {
        console.log('no user');
    }
})

function saveDataToFirestore() {
  
  const loanId = loanData.loanName;

  const loanDocRef = doc(db, "loanData", loanId);
  
  // Guardar los datos en Firestore
  setDoc(loanDocRef, loanData, { merge: true })
    .then(() => {
      console.log("Los datos del préstamo se han guardado exitosamente en Firestore");
      Swal.fire({
        icon: 'success',
        title: 'Data saved successfully',
        showConfirmButton: false,
        timer: 1500
      });
      getLoanCards()
      cleadForm()
      loanCardsContainer.innerHTML = ''
    })
    .catch((error) => {
      console.error("Error al guardar los datos del préstamo en Firestore: ", error);
      Swal.fire({
        icon: 'error',
        title: 'There was an error saving the data',
        text: 'Please try again',
        confirmButtonText: 'Ok'
      });
    });


}

function cleadForm() {
    loanName.value = '';
    loanRedline.value = '';
    loanTerm.value = '';
    loanApr.value = '';
    loanMonthly.value = '';
    loanNoItc.value = '';
    loanDealerFee.value = '';
}
getLoanCards()
async function getLoanCards(){
    // set data variable as an empty array 
    data = []  
    // Starts with a query from firebase, where status is active
    const projectInfo = query(collection(db, 'loanData'));
    const querySnapshoot = await getDocs(projectInfo)
    const allData = querySnapshoot.forEach( async(doc) => {
            data.push([
                    doc.data().loanName,
                    doc.data().loanRedline,
                    doc.data().loanTerm,
                    doc.data().loanApr,
                    doc.data().loanMonthly,
                    doc.data().loanNoItc,
                    doc.data().loanDealerFee,
            ])
    })
    // once you get data, proceed to generate cards using a function
    // this is the div where cards will be displayed
    let mainDiv = document.getElementById('loanCardsContainer')
    // we have to clear main div before run function, to avoid duplicated values
    mainDiv.innerHTML = ''
    // get all data from 'data' variable, each element from the array will be named el
    data.forEach( (el) => {
        let card = document.createElement('div');
        card.classList.add('card', 'h-100', 'bg-dark', 'm-2');
        card.style.width = '15rem';
      
        // Create the card header element
        let cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'bg-dark', 'mb-2');
      
        // Create the row element for the header text
        let rowHeader = document.createElement('div');
        rowHeader.classList.add('row');
      
        // Create the h3 element for the header text
        let headerText = document.createElement('h3');
        headerText.textContent = el[0];
      
        // Append the header text to the row element, and the row element to the card header element
        rowHeader.appendChild(headerText);
        cardHeader.appendChild(rowHeader);
      
        // Create the card body element
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-boddy', 'bg-dark',  'mb-2', 'text-left');
      
        // Create the h4 elements for the body text
        let bodyText1 = document.createElement('p');
        bodyText1.classList.add('text-left')
        bodyText1.textContent = 'Redline: ' + el[1];
        let bodyText2 = document.createElement('p');
        bodyText2.classList.add('text-left')
        bodyText2.textContent = 'TERM: ' + el[2];
        let bodyText3 = document.createElement('p');
        bodyText3.classList.add('text-left')
        bodyText3.textContent = 'APR: ' + el[3];
        let bodyText4 = document.createElement('p');
        bodyText4.classList.add('text-left')
        bodyText4.textContent = 'MONTHLY: ' + el[4];
        let bodyText5 = document.createElement('p');
        bodyText5.classList.add('text-left')
        bodyText5.textContent = 'NO ITC: ' + el[5];
        let bodyText6 = document.createElement('p');
        bodyText6.classList.add('text-left')
        bodyText6.textContent = 'DEALER FEE: ' + el[6];
      
        // Append the body text elements to the card body element
        cardBody.appendChild(bodyText1);
        cardBody.appendChild(bodyText2);
        cardBody.appendChild(bodyText3);
        cardBody.appendChild(bodyText4);
        cardBody.appendChild(bodyText5);
        cardBody.appendChild(bodyText6);
      
        // Create the card footer element
        let cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer', 'bg-dark');
      
        // Create the edit button element
        let editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-outline-info', 'editInstallerButton');
        editButton.dataset.loan = el[0];
        editButton.dataset.redline = el[1];
        editButton.dataset.term = el[2];
        editButton.dataset.apr = el[3];
        editButton.dataset.monthly = el[4];
        editButton.dataset.noItc = el[5];
        editButton.dataset.dealerFee = el[6];
        editButton.textContent = 'Edit';
      
        // Append the edit button to the card footer element
        cardFooter.appendChild(editButton);
      
        // Append the header, body, and footer elements to the main card element
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        mainDiv.appendChild(card)
      
    })
    
    // Edit Installer
    // get all buttons with class name editInstallerButton
    let editInstallerButton = document.querySelectorAll('.editInstallerButton')
    
    editInstallerButton.forEach( (btn) => {
    // when click editInstallerButton button copy dato from dataset to form
            btn.addEventListener('click', (el) => {
                 
                loanName.value = el.target.dataset.loan,
                loanRedline.value = el.target.dataset.redline,
                loanTerm.value = el.target.dataset.term,
                loanApr.value = el.target.dataset.apr,
                loanMonthly.value = el.target.dataset.monthly,
                loanNoItc.value = el.target.dataset.noItc,
                loanDealerFee.value = el.target.dataset.dealerFee  
            })
            
    })
            
}


/*
<div class="card h-100 bg-dark m-2" style="width: 15rem;">
                      <div class="card-header bg-dark mb-2">
                        <div class="row">
                          <h3>CORE</h3>
                        </div>
                      </div>
                      <div class="card-boddy bg-dark mx-auto mb-2">
                        <h4>Redline: 2.5</h4>
                        <h4>TERM: $3,000.00</h4>
                        <h4>APR: $3,000.00</h4>
                        <h4>MONTHLY: $3,000.00</h4>
                        <h4>NO ITC: $3,000.00</h4>
                        <h4>DEALER FEE: $3,000.00</h4>
                      </div>
                      <div class="card-footer bg-dark">
                        <button class="btn btn-outline-info editInstallerButton" data-installer="CORE" data-redline="2.5" data-mpu="3000">Edit</button>
                      </div>
                    </div>
*/                    