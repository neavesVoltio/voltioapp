import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
const db = getFirestore(app) 

let loan = [  
  ['Swift Mosaic 25yr 4.99% 12 months', 2.4, 'Swift Fresno', 300, .0499, ],
  ['Swift Mosaic 25yr 5.59% 18 months', 2.40, 'Swift Fresno', 300, 5.59, 494.11, 683.28, 0, 2.40, 40.90, 0.004855024655, 0.006713680414, 0, 'Fast', 'PS400M6H-18/VHB Cali', 0.4, 680],
  ['Swift Mosaic 25yr 4.59% Level pay', 2.40, 'Swift Fresno', 300, 4.59, 372.64, 532.35, 0, 2.40, 45.50, 0.003661432, 0.005230743, 0, 'Fast', 'PS400M6H-18/VHB Cali', 0.4, 680],
  ['Core Mosaic 25yr 3.99% Choice', 2.60, 'Core Cali', 300, 3.99, 389.01, 556.03, 0, 2.60, 36.50, 0.003822348, 0.005463444, 0, 'Fast', 'Solarever 445 Cali', 0.445, 750],
  ['Core Enium 25yr 5.99% LP', 2.60, 'Core Cali', 300, 5.99, 478.45, 681.48, 0, 2.60, 23.00, 0.004701161, 0.006696001, 0, 'Fast', 'Solarever 445 Cali', 0.445, 750],
  ['Tempo Vegas 2.99% Concert 25yr 12mo', 2.20, 'Tempo Vegas', 300, 2.99, 351.97, 496.15, 0, 2.20, 37.59, 0.00345833, 0.004875, 0, 'Fast', 'PS400M6H-18/VHB Cali', 0.4, 680]
];

console.log(data[0].length);
let loanName = loan[0]
let C17 = loan[1] // Redline
let B9 = loan[2] // Contractor
let D7 = loan[3] // Term
let C7 = loan[4] // APR% 
let E7 = loan[5] // Monthly
let F7 = loan[6] // No ITC
let G7 = loan[7] // Promo
let B7 = loan[8] // Dealer Fee
let D13 = loan[9] // Panel Size
let E13 = loan[10] // Panel Kwh Yr
let F13 = loan[11] // MODULE 

/*
LOAN                            = C9 = 'LOAN NAME' SELECT FROM A LIST
                                  let loan = ['DealerFee', 'Contractor', 'PanelSize', 'PanelKwhYr', 'MODULE', 'Redline', 'APR', 'Term', 'Monthly', 'NoITC', 'Promo', 'loan']

Dealer Fee                      = let B7 = loan[1] **
Contractor                      = let B9 = loan[2] **
Panel Size	                    = let D13 = loan[3] 
Panel Kwh Yr	                  = let E13 = loan[4]
MODULE                          = let F13 = loan[5]
Redline	                        = let C17 = loan[6] **
APR%                            = let C7 = loan[7] **
Term                            = let D7 = loan[8]  **
Monthly                         = let E7 = loan[9] **
No ITC                          = let F7 = loan[10] **
Promo                           = let G7 = loan[11] **

MODEL                           = F15 = DEPENDE DE B9
kWh Capacity                    = G15 = DEPENDE DE B9
MPU                             = B21 = if(B19="No",0,DEPENDE DE B9)        
Battery Cost	                = C21 = if(C19="No",0,DEPENDE DE B9)
Enphase Cost	                = E21 = if(E19="No",0,DEPENDE DE B9)*B11
Addon Cost                      = F21 = if(F19="No",0,DEPENDE DE B9)
Small System	                = G21 = if(B11<4000,DEPENDE DE B9,0)
EPC Adder                       = H21 = DEPENDE DE B9
Reroof Cost	                    = D21 = ** MANUAL **  
Target Sys Price                = A2 = ** MANUAL **
Usage:	                        = B13 = ** MANUAL **
Panels (+-)                     = C13 = ** MANUAL ** 
Set Voltio Cms RedL.	        = B17 = ** SELECT FROM A LIST **
MPU	                            = B19 = SELECT FROM A LIST WITH OPTIONS: YES,NO
Batteries	                    = C19 = SELECT FROM A LIST WITH OPTIONS: YES,NO
Reroof Done By	                = D19 = SELECT FROM A LIST WITH OPTIONS: VOLTIO, NO REROOF, EPC
Enphase Micro	                = E19 = SELECT FROM A LIST WITH OPTIONS: YES,NO
Addon	                        = F19 = SELECT FROM A LIST WITH OPTIONS: YES,NO
Cashback                        = G19 = ** MANUAL **
Misc. Addon                     = H19 = ** MANUAL **
Setter Pay	                    = B25 = ** MANUAL **
Closer CMS Mod	                = A27 = ** MANUAL ** 
Nightime Usage	                = D15 = 30% // VALOR QUE SOLO CAMBIA EL ADMIN
Set Closer CMS PPW	            = B23 = VALOR QUE SOLO CAMBIA ADMIN
Manager Pay KW	                = B27 = SOLO LO CAMBIA EL ADMIN

Panel #                         = D11 = B13/E13+C13
System Size	                    = B11 = D13*D11*1000
Total Rep CMS                   = F5 = B23*B11+A27
Adders Total                    = G5 = B21+C21+if(D19="No Reroof",0,0)+(E21+F21+H21+G21+G19+H19)+if(D19="EPC",D21,0)+if(D19="VOLTIO",D21,0)
EPC Base	                    = D5 = B11*C17
Contract Amount                 = B5 = (D5+G5+E5+F5)/(100%-B7)	
Dealer Fee                      = C5 = B5*B7
Voltio Cms RedL.                = B2 = (A2-F5-G5-D5-C5)/B11
Voltio CMS                      = E5 = B17*B11
Total EPC P.out                 = H5 = B5-C5-D5-G5+G19+H19+if(D19="VOLTIO",D21,0)
Gen yearly Kwh                  = E11 = (E13*D11)-(E13*D11*15%)
Offset	                        = C11 = E11/B13
Kwh/Kw                          = F11 = E11/B11
Usage/Month  kWh	            = B15 = B13/12
Daily/kWh	                    = C15 = B15/30
Battery Size kWh	            = E15 = D15*C15
Total Rep CMS PPW	            = D17 = F5/B11
Adders	                        = E17 = G5/B11
Total PPW	                    = F17 = B17+C17+D17+E17
Dealer fee PPW	                = G17 = B5/B11
Final PPW                       = H17 = F17+G17
Manager Override                = C27 = B11*B27/1000
Setter CMS	                    = C25 = F5*B25-(C27*B25)
Closer CMS	                    = C23 = F5-C25-((100%-B25)*C27)-(C27*B25)
Closer CMS KW                   = D23 = C23/B11*1000
Setter CMS KW                   = D25 = C25/B11*1000



<select id="mpuSelect" name="mpu">
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>

<select id="batteriesSelect" name="batteries">
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>

<select id="reroofSelect" name="reroofDoneBy">
  <option value="Voltio">Voltio</option>
  <option value="No Reroof">No Reroof</option>
  <option value="EPC">EPC</option>
</select>

<select id="enphaseSelect" name="enphaseMicro">
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>

<select id="addonSelect" name="addon">
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>

  const mpu = document.getElementById("MPU").value;
  const batteries = document.getElementById("Batteries").value;
  const reroof = document.getElementById("ReroofDoneBy").value;
  const enphase = document.getElementById("EnphaseMicro").value;
  const addon = document.getElementById("Addon").value;

  */