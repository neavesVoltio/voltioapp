
// ya vez la deduccion que se hace a los managers y a voltio mientras el precio se reduce
// me gustaria tener un botton o switch para apagar eso
// que se quede commission fija a voltio y a el manager
// al momento de cambiar el precio en e.ppw
// por ejemplo estabamos con el plan de reducir en la cantidades programadas asi como esta el google sheets pero hoy hicimos el cambio de nuevo donde no se le reduce a el manager ni a voltio



export function calculations(tot) {


let systemPriceText = document.getElementById('systemPriceText')
let systemSizeText = document.getElementById('systemSizeText')
let finalVoltioComisionText = document.getElementById('finalVoltioComisionText')
let epcPayoutText = document.getElementById('epcPayoutText')
let offsetText = document.getElementById('offsetText')
let panelNumberText = document.getElementById('panelNumberText')
let genKwH = document.getElementById('genKwH')
let KwhKw = document.getElementById('KwhKw')
let projectMPU = document.getElementById('projectMPU')
let projectUsage = document.getElementById('projectUsage')
let utilityAverageMonthly = document.getElementById('utilityAverageMonthly')
let totalYearlyPayment = document.getElementById('totalYearlyPayment')
let averageMonthlyPayment = document.getElementById('averageMonthlyPayment')
let targetCommission = document.getElementById('targetCommission')
let projectCmsMod = document.getElementById('projectCmsMod')
let projectCost = document.getElementById('projectCost')
let totalAdders = document.getElementById('totalAdders').value
let projectCustomerCashBack = document.getElementById('ProjectCustomerCashBack').value
utilityAverageMonthly.value = (projectUsage.value / 12 ).toFixed(0)
averageMonthlyPayment.value = (totalYearlyPayment.value / 12).toFixed(0)
let A = document.getElementById('projectUsage') // 7500)
let B // SYSTEM PRICE, NO SE UTILIZA EN OTRAS FORMULAS
let C
let D
let E
let F = document.getElementById('projectCmsMod') // -0.3
let G 
let H
let I
let J
let K
let L
let M
let N
let O
let P
let Q
let R
let S
let T
let U
let V
let W
let X
let Y
let Z
let AA
let AB
let AC
let AD
let AE
let AF
let AG
let AH
let AI
let AJ = projectMPU // 'YES'
let AK = document.getElementById('projectAddOnSystem') //'YES'
let AL
let AM
let AN
let AO
let AP
let AQ
let AR
let AS
let AT
let AU
let AV
let AW
let AX
let AY = document.getElementById('projectPanelSize') // 0.395
let AZ = document.getElementById('projectPanelKwhYr') //610
let BA = document.getElementById('projectPanelsNumber') //3
let BB
let BC
let BD
let BE
let BF
let BG = document.getElementById('projectAdminFee') // 1500
let BH = document.getElementById('projectEpcFee') //1500
let BI = document.getElementById('projectMPUPrice') //3000
let BJ = document.getElementById('projectRoofCost') //1000
let BK
let BL
let BM =  projectCustomerCashBack === '' ? 0 : projectCustomerCashBack
let BN
let BO
let BP
let BQ
let BR
let BS
let BT
let BU
let BV
let BW
let BX
let BY
let BZ
let CA
let CB
let CC
let CD
let CE
let CF
let CG
let CH
let CI = document.getElementById('projectRedline') // 2.3
let CJ
let CK
let CL
let CM
let CN = document.getElementById('projectSetEPpw') // 1.10
let CO
let CP
let CQ
let CR
let CS
let CT = document.getElementById('projectMgrCmsPpw') // .3
let CU
let CV
let CW
let CX
let CY
let CZ
let DA
let DB
let DC
let DD
let DE
let DF
let DG = document.getElementById('projectNPpw') // 1.3
let DH
let DI
let DJ
let DK
let DL
let DM
let DN
let DO
let DP
let DQ
let DR = document.getElementById('projectDfeeCmsP') // 0
let DS = document.getElementById('projectDfeeCms') // 0
let DT
let DU = document.getElementById('projectLoanDfee') // .3
let DV
let DW
let DX
let DY
let DZ

    let sumOfAdders = !tot ? totalAdders : tot
    console.log('sum of adders: '+ sumOfAdders);
    console.log(A.value);
    console.log('redline: ' + CI.value);
    console.log('mpu: ' + BI.value);
    BC = Math.floor((parseFloat(A.value)/parseFloat(AZ.value)) + parseFloat(BA.value))
    console.log('BC=' + BC)
    C = parseFloat(BC*parseFloat(AY.value)) //.toFixed(2)
    console.log('C=' + C)
    console.log('C * 1000=' + C * 1000)
    DM = parseFloat(parseFloat(DG.value)+parseFloat(CT.value)+parseFloat(CN.value)).toFixed(2)
    console.log('DM=' + DM)
    let DMxF = DM*parseFloat(F.value)
    DO = ((DM*parseFloat(F.value)) * 0.12 * (C * 1000))
    console.log('DO=' + DO)
  
    DP = ((DM*parseFloat(F.value)) * 0.528 * (C * 1000))
    console.log('DP=' + DP)
    DH = (parseFloat(DG.value)*(C*1000))+ DP
    console.log('DH=' + DH)
    CU = (parseFloat(CT.value)*DH)+DO
    console.log('CU=' + CU)
  
    CV = (CU/C)/1000 < 0.1 ? 0.1 : (CU/C)/1000
    console.log('CV=' + CV)
  
    CW = CV < 0.1 ? CV* (C*1000) : 0
    console.log('CW=' + CW)
  
    CX = CV < 0.1 ? CU-CW : 0
    console.log('CX=' + CX)
    DV = parseFloat(DU.value)+parseFloat(DR.value)
    console.log('DV=' + DV)
    CY = CU/(1-DV)
    console.log('CY=' + CY)
    
    DN = ((DM*parseFloat(F.value)) * 0.352 * (C* 1000)) + CX
    console.log('DN=' + DN)
    CO = (parseFloat(CN.value)* (C*1000))+DN
    console.log('CO=' + CO)
    
    D = CO+parseFloat(BG.value)+parseFloat(DS.value)
    console.log('D=' + D)
    BL = C < 4 ? 1000 : 0
    BK = AK.value === '1' ? 1000 : 0
    console.log('AK= ' + AK.value);
    console.log('BK (Add On sistem: ' + BK);
    console.log('BM, CASH BACK: ' + BM);
    let sumForCE = parseFloat(BG.value)+parseFloat(BH.value)+parseFloat(BI.value)+parseFloat(BJ.value)+parseFloat(BK)+parseFloat(BL)+parseFloat(BM)+ sumOfAdders
    console.log('sum of adders: ' + sumOfAdders);
    console.log('sum of tot: ' + tot);
    CE = !projectUsage.value || projectUsage.value <= 0 ? 0 : sumForCE
    console.log('CE=' + CE)
    E = CO+DH+CE+parseFloat(DS.value)
    console.log('E=' + E)
    
    BD = parseFloat(AZ.value)*BC
    console.log('BD=' + BD)
    BB = BD/parseFloat(A.value)
    console.log('BB=' + BB)
    BE = BD/C
    console.log('BE=' + BE)
    CD = (CE/C)/1000
    console.log('CD=' + CD)
    
    
    CF = CE/(1-DV)
    console.log('CF=' + CF)
    CG = (CF/C)/1000
    console.log('CG=' + CG)
    CJ = C*parseFloat(CI.value)*1000
    console.log('CJ=' + CJ)
    CK = (parseFloat(CI.value)*(C*1000))/(1-DV)
    console.log('CK=' + CK)
    CL = (CK/C)/1000
    console.log('CL=' + CL)
    CP = (CO/C)/1000
    console.log('CP=' + CP)
    CQ = CO/(1-DV)
    console.log('CQ=' + CQ)
    CR = (D/C)/1000
    console.log('CR=' + CR)
    
    CZ = CY/(C*1000)
    console.log('CZ=' + CZ)
  
    
    DC = DH/2
    console.log('DC=' + DC)
    DB = (DC/C)/1000
    console.log('DB=' + DB)
    DD = DC/(1-DV)
    console.log('DD=' + DD)
    DE = DD/(C*1000)
    console.log('DE=' + DE)
    
    DI = (DH/C)/1000
    console.log('DI=' + DI)
    DJ = DH/(1-DV)
    console.log('DJ=' + DJ)
    DK = DJ/(C*1000)
    console.log('DK=' + DK)
    
    
    DW = CD+parseFloat(DG.value)+parseFloat(CN.value)+parseFloat(CI.value)
    console.log('DW=' + DW)
    
    B = CK+CQ+DJ+CF 
      console.log('B=' + B)
    
    DX = CG+DK+CR+CL
    console.log('DX=' + DX)
    
    systemPriceText.innerHTML = B.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    systemSizeText.innerHTML = C.toFixed(2)
    finalVoltioComisionText.innerHTML = D.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    epcPayoutText.innerHTML = E.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    offsetText.innerHTML = (BB.toFixed(2) * 100).toFixed(2) + '%'
    panelNumberText.innerHTML = + BC
    genKwH.innerHTML = BD.toFixed(2) + ' kWh'
    KwhKw.innerHTML = isNaN( BE.toFixed(2)) ? 0 + ' kWh' : BE.toFixed(2) + ' kWh'
    targetCommission.innerHTML = DH.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    projectCost.innerHTML = B.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    
  
  }

  projectUsage.addEventListener('blur', (e) => {
    console.log('project usage: ' + projectUsage.value);
    if(projectUsage.value === ''){
      console.log('no project usage');
      return
    } else {
      utilityAverageMonthly.value = (projectUsage.value / 12 ).toFixed(0)
      
      calculations()
    }
    
  })

  totalYearlyPayment.addEventListener('blur', (e) => {
    if(averageMonthlyPayment.value === ''){
      console.log('no average value');
      return
    }

    averageMonthlyPayment.value = (totalYearlyPayment.value / 12).toFixed(0)
  })
  
  projectCmsMod.addEventListener('change', (e) => {
    calculations()
  })

// ya vez la deduccion que se hace a los managers y a voltio mientras el precio se reduce
// me gustaria tener un botton o switch para apagar eso
// que se quede commission fija a voltio y a el manager
// al momento de cambiar el precio en e.ppw
// por ejemplo estabamos con el plan de reducir en la cantidades programadas asi como esta el google sheets pero hoy hicimos el cambio de nuevo donde no se le reduce a el manager ni a voltio


