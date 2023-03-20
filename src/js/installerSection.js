import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc, arrayUnion  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';

const db = getFirestore(app) 
let data = []  
let installerStatus = 'active'
let epcName = document.getElementById('epcName')
let epcRedline = document.getElementById('epcRedline')
let epcMPU = document.getElementById('epcMPU')
let addEpcButtonToServer = document.getElementById('addEpcButtonToServer')
let installerGlobalName
// Verify if somebody is logged
onAuthStateChanged(auth, async(user) => {
    if(user){
				// button to add Installer
				addEpcButtonToServer.addEventListener('click', async (e) => {

						if(epcName.value === '' || epcRedline.value === '' || epcMPU.value === ''){
								// sweet alert when error
								Swal.fire({
										position: 'top-end',
										icon: 'warning',
										title: 'All fields are required',
										showConfirmButton: false,
										timer: 1500
									})
								return
						} else {
								// if all fields are completed, use setDoc to add or update installer on firestore
								// We are going to use installer name as main key, to avoid duplicated values
								installerGlobalName = epcName.value
								await setDoc(doc(db, 'installerList', epcName.value),{
										installerName: epcName.value,
										installerRedline: parseFloat(epcRedline.value),
										epcMPU: parseFloat(epcMPU.value), 
										status: installerStatus
								// if success then will send a sweet aler, run getInstaller function to update cards
								// and clear all field to prepare for a new entry    
								}).then( () => {
										Swal.fire({
												position: 'top-end',
												icon: 'success',
												title: '',
												showConfirmButton: false,
												timer: 1500
											})
										
										document.getElementById('installerCardsContainer').innerHTML = ''
										getInstallerCards()
										saveAdders()
										
										epcName.value = ''
										epcRedline.value = ''
										epcMPU.value = ''
										// change title and clear status option after edit installer
										document.getElementById('addInstallerTitle').innerHTML = 'Add Installer..'
										document.getElementById('statusSelectContainer').innerHTML = ''
										document.getElementById('addersContainers').innerHTML = ''
										document.getElementById('locationContainers').innerHTML = ''
										
								})
						}
				})

				// Function to get cards from query
				// call the function to get cards when open page
				getInstallerCards()
				async function getInstallerCards(){
						// set data variable as an empty array 
						data = []  
						// Starts with a query from firebase, where status is active
						const projectInfo = query(collection(db, 'installerList'), where('status', '==', 'active'));
						const querySnapshoot = await getDocs(projectInfo)
						const allData = querySnapshoot.forEach( async(doc) => {
								data.push([
										doc.data().installerName,
										doc.data().installerRedline,
										doc.data().epcMPU,
								])
						})
						// once you get data, proceed to generate cards using a function
						// this is the div where cards will be displayed
						let mainDiv = document.getElementById('installerCardsContainer')
						// we have to clear main div before run function, to avoid duplicated values
						mainDiv.innerHTML = ''
						// get all data from 'data' variable, each element from the array will be named el
						data.forEach( (el) => {
								
								// create html elements and assign a variable for each one
								let divCard = document.createElement('div')
								let divCardHeader = document.createElement('div')
								let h3InstallerName = document.createElement('h3') 
								let divCardBoddy = document.createElement('div')
								let h4Redline = document.createElement('h4')
								let h4Mpu = document.createElement('h4')
								let divCardFooter = document.createElement('div')
								let btnEdit = document.createElement('button')
								let deleteButton = document.createElement('a')
								let headerRow = document.createElement('div')

								// assing attributes to each element 
								divCard.classList = 'card h-100 bg-dark m-2'
								divCard.style.width = '15rem'
								deleteButton.classList = 'btn btn-danger deleteInstaller'
								deleteButton.innerHTML = 'X'
								headerRow.classList = 'row'
								divCardHeader.classList = 'card-header bg-dark mb-2'
								h3InstallerName.innerHTML = el[0]
								divCardBoddy.classList = 'card-boddy bg-dark mx-auto mb-2'
								h4Redline.innerHTML = 'Redline: ' + el[1]
								h4Mpu.innerHTML = 'MPU: ' + el[2].toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD',
										}); 
								divCardFooter.classList = 'card-footer bg-dark'
								btnEdit.classList = 'btn btn-outline-info editInstallerButton'
								btnEdit.innerHTML = 'Edit'
								btnEdit.dataset.installer = el[0]
								btnEdit.dataset.redline = el[1]
								btnEdit.dataset.mpu = el[2]

								// append on main div
								mainDiv.appendChild(divCard)
								divCard.appendChild(divCardHeader)
								divCard.appendChild(divCardBoddy)
								divCard.appendChild(divCardFooter)
								divCardHeader.appendChild(headerRow)
								headerRow.appendChild(h3InstallerName)
								divCardBoddy.appendChild(h4Redline)
								divCardBoddy.appendChild(h4Mpu)
								divCardFooter.appendChild(btnEdit)
						})
						
						// Edit Installer
						// get all buttons with class name editInstallerButton
						let editInstallerButton = document.querySelectorAll('.editInstallerButton')
						
						editInstallerButton.forEach( (btn) => {
						// when click editInstallerButton button copy dato from dataset to form
								btn.addEventListener('click', (el) => {
										// get data from dataset
										document.getElementById('statusSelectContainer').innerHTML = '';
										installerGlobalName = el.target.dataset.installer 
										let installer = el.target.dataset.installer 
										let redline = el.target.dataset.redline 
										let mpu = el.target.dataset.mpu 
										// create select element for active/inactive
										let divStatusSelectContainer = document.createElement('div')
										let labelStatusSelect = document.createElement('label')
										let selectStatus = document.createElement('select')
										let optionActive = document.createElement('option')
										let optionInactive = document.createElement('option')

										// assing attributes to each element 
										divStatusSelectContainer.classList = 'mb-3'
										labelStatusSelect.classList = 'form-label text-light'
										labelStatusSelect.innerHTML = 'Status'
										selectStatus.classList = 'form-select bg-dark border-info text-light text-start changeStatus'
										optionActive.setAttribute ='selected'
										optionActive.value = 'active'
										optionActive.innerHTML = 'Active'
										optionInactive.value = 'inactive'
										optionInactive.innerHTML = 'Inactive'

										// set elements on form
										let statusSelectContainer = document.getElementById('statusSelectContainer')
										statusSelectContainer.appendChild(labelStatusSelect)
										statusSelectContainer.appendChild(selectStatus)
										selectStatus.appendChild(optionActive)
										selectStatus.appendChild(optionInactive)

										// copy this data to form
										document.getElementById('epcName').value = installer
										document.getElementById('epcRedline').value = redline
										document.getElementById('epcMPU').value = mpu
										document.getElementById('addInstallerTitle').innerHTML = 'Edit Installer..'
										
										// update installerStatus variable when change status
										selectStatus.addEventListener('change', (e) => {
												console.log(e.target.value)
												// if selectStatus = inactive and click on submit, the card will dissapear bcuz inactive status
												installerStatus = e.target.value
										})

										// show adders tab
										let addersAccordeon = document.getElementById('addersAccordeon')
										let locationAccordeon = document.getElementById('locationAccordeon')
										addersAccordeon.style.display = 'block'
										locationAccordeon.style.display = 'block'
										getAddersByInstaller (installer)
										deleteRow(e)
								})
								
						})
								
				}

				// function to add Adders to Installer
				// create a global variable to get all adders
				let adders = []
				// get all Add buttons
				
				let addAdderButtonNs = document.getElementById('addAdderButtonNs')

				addAdderButtonNs.addEventListener('click', (e) =>{
					addNewAdderRow()
					// remove adders rows by click -
					let deleteAddersRow = document.querySelectorAll('.deleteRow');
					deleteAddersRow.forEach(function(item) {
						item.addEventListener('click', function (e) {
							console.log('click');
						console.log(e.target.closest(".stateNameDropdown").value);	
							e.target.closest(".table-row").remove();
							
						});
					});
				})

				// function to create new adder row
				function addNewAdderRow(adderNameData, qtyData){
					let mainContainer = document.getElementById("addersContainers")
					let addersTitleContainer = document.createElement("tr");
					
					 let adderTableRow = document.createElement("tr");
					 let adderNameTableData = document.createElement("td");
					 let valueTableData = document.createElement("td");
					 let valueInput = document.createElement("input");
					 let valueInputAdderName = document.createElement("input");
					 let deleteButton = document.createElement('a');

					 deleteButton.className = 'btn btn-danger border-0 text-danger bg-transparent fb-4 deleteRow'
					 deleteButton.textContent = '-'	
					 valueTableData.className = "bg-transparent text-light border-info"
					 valueInput.className = "form-control bg-transparent text-light border-info sumOfAdders"
					 adderTableRow.className = "bg-transparent text-light border-info table-row"
					 adderNameTableData.className = "bg-transparent text-light border-info"
					 valueInput.type = "number"
					 valueInput.name = "qty"
					 valueInput.value = !qtyData ? 0 : qtyData
				
					 valueInputAdderName.className = "form-control bg-transparent text-light border-info"
					 valueInputAdderName.type = "text"
					 valueInputAdderName.name = "adderName"
					 valueInputAdderName.value = !adderNameData ? '' : adderNameData
				
					 mainContainer.append(adderTableRow)
					 adderTableRow.appendChild(adderNameTableData)
					 adderTableRow.appendChild(valueTableData)
					 adderTableRow.appendChild(deleteButton)
					 valueTableData.appendChild(valueInput)
					 adderNameTableData.appendChild(valueInputAdderName)
					
				}

				async function saveAdders(){
					var qty = document.getElementsByName('qty')
					var adderName = document.getElementsByName('adderName')
					let addersData = []
			
					for(var i=0;i<qty.length;i++){
						let rowData = {}
						rowData.qtyData = qty[i].value
						rowData.adderNameData = adderName[i].value
						addersData.push(rowData)
					}

					saveLocations(addersData)
				}

				// get adders by installer
				async function getAddersByInstaller (installer) {
					document.getElementById('addersContainers').innerHTML = '';
					document.getElementById('locationContainers').innerHTML = ''
					// Starts with get doc by installer name
					const docRef = doc(db, "installerList", installer);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						// get adders list by current installer
						let addersList = docSnap.data().adders
						
						// this for create list of installers
						for (let i = 0; i < addersList.length; i++) {
							const adderNameData = addersList[i].adderNameData;
							const qtyData = addersList[i].qtyData;
							addNewAdderRow(adderNameData, qtyData)
						
						}
						
						// agregar esta funcion despues de obtener los datos 
						getInstallerCoverage()
				// remove adders rows by click -
					let deleteAddersRow = document.querySelectorAll('.deleteRow');
					deleteAddersRow.forEach(function(item) {
						item.addEventListener('click', function (e) {
							console.log('click');
							e.target.closest(".table-row").remove();
						});
					});

					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}	
				}

				function addNewLocationRow(state){
					let stateArray = [state]
					
					let mainContainer = document.getElementById("locationContainers")
					let addersTitleContainer = document.createElement("tr");
					
					 let adderTableRow = document.createElement("tr");
					 let adderNameTableData = document.createElement("td");
					 let valueTableData = document.createElement("td");
					 let locationNameInput = document.createElement("select");
					 let deleteButton = document.createElement('a');
					 let regions = !state ? [ ["CALIFORNIA", " SAN JOSE"],
					 				["CALIFORNIA", " FRESNO"],
									["CALIFORNIA", " SALINAS"],
									["CALIFORNIA", " SAN BERNARDINO"],
									["CALIFORNIA", " SAN DIEGO"],
									["NEVADA", " NEVADA"]] : stateArray
					 
					 deleteButton.className = 'btn btn-danger border-0 text-danger bg-transparent fb-4 deleteRow'
					 deleteButton.textContent = '-'	
					 valueTableData.className = "bg-transparent text-light border-info"
					 adderTableRow.className = "bg-transparent text-light border-info table-row"
					 adderNameTableData.className = "bg-transparent text-light border-info"
					 locationNameInput.className = "form-select bg-dark shadow text-light border-info text-start stateNameDropdown"
					 locationNameInput.name = "state"
					 locationNameInput.vale = !state ? '' : state
				
					 mainContainer.append(adderTableRow)
					 adderTableRow.appendChild(adderNameTableData)
					 adderTableRow.appendChild(valueTableData)
					 adderTableRow.appendChild(deleteButton)
					 adderNameTableData.appendChild(locationNameInput)

					 regions.forEach(function(item) {
						let stateOption = document.createElement('option');
						locationNameInput.append(stateOption)
						stateOption.innerHTML = !state ? item : state
					 });
					 
				}

	async function saveLocations(addersData){
					//var locationName = document.getElementsByName('locationName')
					var state = document.getElementsByName('state')
					let locationData = []
			
					for(var i=0;i<state.length;i++){
						let rowData = {}
						//rowData.locationName = locationName[i].value
						rowData.state = state[i].value
						locationData.push(state[i].value)
						// locationData.push(rowData)
					}
					
					await setDoc(doc(db, 'installerList', epcName.value),{
						installerName: epcName.value,
						installerRedline: parseFloat(epcRedline.value),
						epcMPU: parseFloat(epcMPU.value), 
						status: installerStatus,
						adders: addersData,
						// locationData: locationData
						
					// if success then will send a sweet aler, run getInstaller function to update cards
					// and clear all field to prepare for a new entry    
					}).then( () => {
							Swal.fire({
									position: 'top-end',
									icon: 'success',
									title: '',
									showConfirmButton: false,
									timer: 1500
								})
										
							locationData.forEach( async function(item) {
								const docRef = doc(db, 'coverageArea', item)
								const docSnap = await getDoc(docRef)
								if(docSnap.exists()) {
									
									let installerByRegion = docSnap.data().installer
									console.log(installerByRegion);
										await updateDoc(doc(db, 'coverageArea', item),{
											installer: arrayUnion(installerGlobalName),
										}).then( () => {
											epcName.value = ''
											epcRedline.value = ''
											epcMPU.value = ''
											// change title and clear status option after edit installer
											document.getElementById('addInstallerTitle').innerHTML = 'Add Installer..'
											document.getElementById('statusSelectContainer').innerHTML = ''
											document.getElementById('addersContainers').innerHTML = ''
											document.getElementById('locationContainers').innerHTML = ''
											locationData = []
											addersData = []
										})
								} else {
									console.log('no existe');
									await setDoc(doc(db, 'coverageArea', item),{
										installer: [installerGlobalName],
									})
								}
							});	
							
							
					})
				}
				
	async function getInstallerCoverage(){
			console.log(installerGlobalName);
			const q = query(collection(db, "coverageArea"), where("installer", "array-contains", installerGlobalName));
			let state
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
				state = doc.id
				addNewLocationRow(state)
			}); 
			
			addLocationButtonNs.addEventListener('click', (e) =>{
				deleteRow (e)
			})
			
		}		

	function deleteRow (e) {
		// remove adders rows by click -
		let deleteLocationRow = document.querySelectorAll('.deleteRow');
		deleteLocationRow.forEach(function(item) {
			item.addEventListener('click', function (e) {
				console.log('click');
				e.target.closest(".table-row").remove();
			});
		});
	}

	// add location button

	let addLocationButtonNs = document.getElementById('addLocationButtonNs')

	addLocationButtonNs.addEventListener('click', (e) =>{
		addNewLocationRow()
		deleteRow (e)
	})

    } else{
        console.log('no user logged');
    }
})
/*
<div class="row adderRow"> ....................................................................................................... divAdderRow
<div class="mb-3 col-6"> ......................................................................................................... divSelectAdderContainer
    <label for="adderName" class="form-label text-light">ADDER NAME</label> ...................................................... labelAdderName
    <input type="text" class="form-control bg-dark border-info text-light"> ...................................................... inputAdderName
</div>
<div class="mb-3 col-4"> ......................................................................................................... divPriceContainer
    <label for="adderPrice" class="form-label text-light">ADDER PRICE</label> .................................................... labelPriceAdder
    <input type="number" class="form-control bg-dark border-info text-light" id="adderPrice"> .................................... inputPriceAdder
</div>
<div class="mb-3 col-1 p-1"> ..................................................................................................... divButtonsAddAdderContainer
    <a class="btn btn-outline-info border-0 addAdderRow"> ................................................................... buttonAddAdder
        <h2 class="material-symbols-outlined">+</h2> ............................................................................. h2Icon
    </a>
</div>
<div class="mb-3 col-1 p-1"> ..................................................................................................... divButtonsRemoveAdderContainer
    <a class="btn btn-outline-danger border-0 removeAdderRow">
        <h2 class="material-symbols-outlined">-</h2> ............................................................................. h2RemoveIcon
    </a> .................................................................................................................... buttonRemoveAdder
</div>
</div>
*/
/*
<div class="mb-3"> .............................................. divStatusSelectContainer
<label class="form-label text-light">Status</label>.............. labelStatusSelect
<select class="form-select bg-dark opacity-75 shadow 
    text-white text-start"> ..................................... selectStatus
    <option selected value="active">Active</option> ............. optionActive
    <option value="inactive">Inactive</option> .................. optionInactive
</select>
</div>
*/
/*
<div class="card h-100 bg-dark m-2" style="width: 15rem;"> ...... divCard
    <div class="card-header bg-dark mb-2">  ..................... divCardHeader
        <div class='row'> ....................................... headerRow
            <h3>CORE</h3>  ...................................... h3InstallerName
            <a class='btn btn-danger deleteInstaller'>X</a> ..... deleteButton
        </div>
    </div>
    <div class="card-boddy bg-dark mx-auto mb-2"> ............... divCardBoddy
        <h4>Redline: 2.4</h4> ................................... h4Redline
        <h4>MPU: $ 3,000</h4> ................................... h4Mpu
    </div>
    <div class="card-footer bg-dark"> ........................... divCardFooter
        <button class="btn btn-outline-info">Edit</button> ...... btnEdit
    </div>
</div>
*/