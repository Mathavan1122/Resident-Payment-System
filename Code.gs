var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
var streetSheetName = "JALAN SANGGUL 4";

function doGet(request) {
  var streetSheetName = "JALAN SANGGUL 4"; // Added
  PropertiesService.getScriptProperties().setProperty("streetSheetName", streetSheetName); // Added
  var html = HtmlService.createTemplateFromFile('Index').evaluate() 
  .setTitle("Admin Login")
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
//  var streetSheetName = "JALAN SANGGUL 4"; // Added
//  PropertiesService.getScriptProperties().setProperty("streetSheetName", streetSheetName); // Added
//  return HtmlService.createTemplateFromFile('Index').evaluate()
//  .setTitle("Admin Login")
//  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
//  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

//Check Login
function checkLogin(loginUsername, loginPassword) {
  var url = 'https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1151242353';
  var ss= SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("AdminClerkData");
  var getLastRow =  webAppSheet.getLastRow();
  var found_record = '';
  for(var i = 1; i <= getLastRow; i++)
  {
     if(webAppSheet.getRange(i, 3).getValue() == "1") //admin=1, clerk=0
     {
       if(webAppSheet.getRange(i, 1).getValue() == loginUsername && 
         webAppSheet.getRange(i, 2).getValue() == loginPassword)
       {
         found_record = 'ADMIN_TRUE';
       }
       if(found_record == '')
       {
         found_record = 'FALSE'; 
       }
     }    
     else if(webAppSheet.getRange(i, 3).getValue() == "0")
     {
       if(webAppSheet.getRange(i, 1).getValue() == loginUsername && 
         webAppSheet.getRange(i, 2).getValue() == loginPassword)
       {
         found_record = 'CLERK_TRUE';
       }  
       if(found_record == '')
       {
         found_record = 'FALSE'; 
       }
     }   
  }
  return found_record;
}

//----------------------------------------------------------------
//--------- Manage Payment ---------------------------------------
function checkPaymentUsername(pm_uname) {
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var ss = SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("USERNAMES");
  var getLastRow =  webAppSheet.getLastRow();
  var streetSheetName = "JALAN SANGGUL 4";
  var found_record = '';
  var name = '';
//  var streetName = ''; //added
//  var pm_hseno = ''; //added
  
  for(var i = 2; i <= getLastRow; i++) {
   if(webAppSheet.getRange(i, 1).getValue() == pm_uname) {
     found_record = 'TRUE';
     name = webAppSheet.getRange(i, 4).getValue().toUpperCase() + " " + webAppSheet.getRange(i, 5).getValue().toUpperCase();
//     pm_hseno = webAppSheet.getRange(i, 2).getValue().toUpperCase();
//     streetName = webAppSheet.getRange(i, 3).getValue().toUpperCase();
   } 
//    else if (username.toUpperCase() == 'ADMIN' && password == 'ADMINPASSWORD') {
//     found_record = 'TRUE';
//     name = webAppSheet.getRange(i, 4).getValue().toUpperCase() + " " + webAppSheet.getRange(i, 5).getValue().toUpperCase();
//     //streetSheetName = webAppSheet.getRange(i, 3).getValue().toUpperCase();
//   }    
  }

PropertiesService.getScriptProperties().setProperty("streetSheetName", streetSheetName); // Added
if(found_record == '') {
  found_record = 'FALSE'; 
}

  return [found_record, pm_uname,name]; // streetName, pm_hseno
  
}

function GetRecords(pm_uname,filter) {
  var filteredDataRangeValues = GetUsernameAssociatedProperties(pm_uname);
  var resultArray = GetPaymentRecords(filteredDataRangeValues,filter);
  var resultFilter = getYears();

  var result = {
    data: resultArray,
    filter: resultFilter
  };
  return result;
}

function getYears() { 
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var ss= SpreadsheetApp.openByUrl(url);
  var yearSheet = ss.getSheetByName("Configuration"); 
  var getLastRow = yearSheet.getLastRow();
  var return_array = [];
  for(var i = 2; i <= getLastRow; i++)
  {
      if(return_array.indexOf(yearSheet.getRange(i, 2).getDisplayValue()) === -1) {
        return_array.push(yearSheet.getRange(i, 2).getDisplayValue());
      }
  }
  return return_array;  
}




function GetUsernameAssociatedProperties(pm_uname) {
  var filteredDataRangeValues = '';
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var ss = SpreadsheetApp.openByUrl(url);
  var displaySheet = ss.getSheetByName("USERNAMES");
  var dataRangeValues = displaySheet.getDataRange().getValues();
  if (pm_uname.toUpperCase() == 'ADMIN') {
    dataRangeValues.shift();
    filteredDataRangeValues = dataRangeValues;
  } else {
    filteredDataRangeValues = dataRangeValues.filter(row => row[0].toUpperCase() == pm_uname.toUpperCase());
  }
  return filteredDataRangeValues;  
}

function GetPaymentRecords(userProperties,filter) {
  var streetSheetName = PropertiesService.getScriptProperties().getProperty("streetSheetName"); // Added
  var transpose = m => m[0].map((_, i) => m.map(x => x[i]));
  var resultArray = [];
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var ss = SpreadsheetApp.openByUrl(url);
  var displaySheet = ss.getSheetByName(streetSheetName);
  var addressValues = displaySheet.getRange("B:C").getValues();
  var paidMonthValues = displaySheet.getRange(1, 7, displaySheet.getLastRow(), displaySheet.getLastColumn() - 6).getValues();
  //Logger.log(addressValues);
  //Logger.log(transpose(paidMonthValues));
  userProperties.forEach((v, i) => {
    var userHouseNumber = v[1];
    var userStreet = v[2];
    var column = addressValues.reduce(function callbackFn(accumulator, currentValue, index, array) {
      if (currentValue[0] == userHouseNumber && currentValue[1] == userStreet) {
        return index
      } else {
        return accumulator
      }
    }, '');
    //Logger.log(column);
    Logger.log(filter)
    Logger.log(paidMonthValues);
    
    if(filter=="None"){
      var result = transpose(paidMonthValues).map(function callbackFn(element, index, array) {
        return [element[0], userHouseNumber, userStreet, element[column] || '']
      });
    }else{
      var result = transpose(paidMonthValues).map(function callbackFn(element, index, array) {
        if(element[0].includes(filter))return [element[0], userHouseNumber, userStreet, element[column] || '']
      });
    }
    
    resultArray = resultArray.concat(result);
    //Logger.log(resultArray);  
  })

  //Remove null elements
  resultArray = resultArray.filter(element=>{
    Logger.log(element!=null)
    return element != null;
  });
  return resultArray;
}

function enterAmount(inputInfo){
  var url = 'https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1151242353';
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Manual Payment");
  var time = new Date();
  var formattedDate = Utilities.formatDate(time, "GMT", "MM-dd-yyyy HH:mm:ss");
  
  //ws.appendRow([formattedDate,inputInfo.amount,inputInfo.uname]);
  var repeatedPayment = ( inputInfo.amount / 50 );
  for(var i = 0; i < repeatedPayment; i++){
           ws.appendRow([formattedDate,inputInfo.uname]);
  }
}

//----------------------------------------------------------------
//--------- CHANGE PASSWORD (ADMIN) ---------------------------------------      

function changeAdminPassword(loginUsername, newAdminPw) {
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var sheet = SpreadsheetApp.openByUrl(url).getSheetByName("Admin Data");
  var range = sheet.getRange("A2:A").createTextFinder(loginUsername).matchEntireCell(true).findNext();
  if (range) {
    range.offset(0, 1).setValue(newAdminPw);
  }
}

//----------------------------------------------------------------
//--------- CHANGE PASSWORD (CLERK) ---------------------------------------      

function changeClerkPassword(loginUsername, newClerkPw) {
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var sheet = SpreadsheetApp.openByUrl(url).getSheetByName("Clerk Data");
  var range = sheet.getRange("A2:A").createTextFinder(loginUsername).matchEntireCell(true).findNext();
  if (range) {
    range.offset(0, 1).setValue(newClerkPw);
  }
}
/*--------------------------------------------------------------------------------------------------------
---------------GLOBAL VARIABLES---------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------
*/

function globalVariables(){ 
  var varArray = {
    spreadsheetId        : '1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8', 
//    admindataRage        : 'Admin Data!A2:B',                                   
//    adminidRange         : 'Admin Data!A2:A',                                    
//    adminlastCol         : 'B',                                            
//    admininsertRange     : 'Admin Data!A1:B1',                                   
//    adminsheetID         : '1151242353',
    clerkdataRage        : 'Clerk Data!A2:B',                                   
    clerkidRange         : 'Clerk Data!A2:A',                                    
    clerklastCol         : 'B',                                            
    clerkinsertRange     : 'Clerk Data!A1:B1',                                   
    clerksheetID         : '1019728383',
    dataRage             : 'USERNAMES!A2:H',                                    
    idRange              : 'USERNAMES!A2:A',                                   
    lastCol              : 'H',                                           
    insertRange          : 'USERNAMES!A1:H1',                                  
    sheetID              : '0'
  };
  return varArray;
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------FUCNTION FOR CLERK CRUD PART-----------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

/* PROCESS FORM */
function processClerkForm(formObject){ 
       if(formObject.clerk_uname && checkClerkID(formObject.clerk_uname)){//Execute if form passes an ID and if is an existing ID
         updateClerkData(getClerkFormValues(formObject),globalVariables().spreadsheetId,getClerkRangeByID(formObject.clerk_uname)); // Update Data
       }else{ //Execute if form does not pass an ID
         appendClerkData(getClerkFormValues(formObject),globalVariables().spreadsheetId,globalVariables().clerkinsertRange); //Append Form Data
       }
  return getClerkLastTenRows();//Return last 10 rows
}


/* GET FORM VALUES AS AN ARRAY */
function getClerkFormValues(formObject){
/* ADD OR REMOVE VARIABLES ACCORDING TO YOUR FORM*/
  if(formObject.clerk_uname && checkClerkID(formObject.clerk_uname)){
    var values = [[
                  //formObject.username.toString(),
                  formObject.clerk_uname,
                  formObject.clerk_pw]];
  }else{
    var values = [[
                  //new Date().getTime().toString(),//https://webapps.stackexchange.com/a/51012/244121
                  formObject.clerk_uname,
                  formObject.clerk_pw]];

  }
  return values;
}



/* CREATE/ APPEND DATA */
function appendClerkData(values, spreadsheetId,range){
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.adminsheetID = spreadsheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
}


/* READ DATA */
function readClerkData(spreadsheetId,range){
  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
  return result.values;
}


/* UPDATE DATA */
function updateClerkData(values,spreadsheetId,range){
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
  valueInputOption: "RAW"});
}


/*DELETE DATA*/
function deleteClerkData(ID){ 
  //https://developers.google.com/sheets/api/guides/batchupdate
  //https://developers.google.com/sheets/api/samples/rowcolumn#delete_rows_or_columns
  var startIndex = getClerkRowIndexByID(ID);
  
  var deleteRange = {
                      "sheetId"     : globalVariables().clerksheetID,
                      "dimension"   : "ROWS",
                      "startIndex"  : startIndex,
                      "endIndex"    : startIndex+1
                    }
  
  var deleteRequest= [{"deleteDimension":{"range":deleteRange}}];
  Sheets.Spreadsheets.batchUpdate({"requests": deleteRequest}, globalVariables().spreadsheetId);
  
  return getClerkLastTenRows();//Return last 10 rows
}



/* CHECK FOR EXISTING ID, RETURN BOOLEAN */
function checkClerkID(ID){
  var idList = readClerkData(globalVariables().spreadsheetId,globalVariables().clerkidRange,).reduce(function(a,b){return a.concat(b);});
  return idList.includes(ID);
}


/* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
function getClerkRangeByID(id){
  if(id){
    var idList = readClerkData(globalVariables().spreadsheetId,globalVariables().clerkidRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        return 'Clerk Data!A'+(i+2)+':'+globalVariables().clerklastCol+(i+2);
      }
    }
  }
}


/* GET RECORD BY ID */
function getClerkRecordById(id){
  if(id && checkClerkID(id)){
    var result = readClerkData(globalVariables().spreadsheetId,getClerkRangeByID(id));
    return result;
  }
}


/* GET ROW NUMBER FOR GIVEN ID */
function getClerkRowIndexByID(id){
  if(id){
    var idList = readClerkData(globalVariables().spreadsheetId,globalVariables().clerkidRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        var rowIndex = parseInt(i+1);
        return rowIndex;
      }
    }
  }
}


/*GET LAST 10 RECORDS */
function getClerkLastTenRows(){
  var lastRow = readClerkData(globalVariables().spreadsheetId,globalVariables().clerkdataRage).length+1;
  if(lastRow<=11){
    var range = globalVariables().clerkdataRage;
  }else{
    var range = 'Clerk Data!A'+(lastRow-9)+':'+globalVariables().clerklastCol;
  }
  var lastTenRows = readClerkData(globalVariables().spreadsheetId,range);
  return lastTenRows;
}


/* GET ALL RECORDS */
function getClerkAllData(){
  var data = readClerkData(globalVariables().spreadsheetId,globalVariables().clerkdataRage);
  return data;
}


/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------FUCNTION FOR ADMIN CRUD PART-----------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

/* PROCESS FORM */
//function processAdminForm(formObject){  
//  if(formObject.admin_uname && checkAdminID(formObject.admin_uname)){//Execute if form passes an ID and if is an existing ID
//    updateAdminData(getAdminFormValues(formObject),globalVariables().spreadsheetId,getAdminRangeByID(formObject.admin_uname)); // Update Data
//  }else{ //Execute if form does not pass an ID
//    appendAdminData(getAdminFormValues(formObject),globalVariables().spreadsheetId,globalVariables().admininsertRange); //Append Form Data
//  }
//  return getAdminLastTenRows();//Return last 10 rows
//}
//
//
///* GET FORM VALUES AS AN ARRAY */
//function getAdminFormValues(formObject){
///* ADD OR REMOVE VARIABLES ACCORDING TO YOUR FORM*/
//  if(formObject.admin_uname && checkAdminID(formObject.admin_uname)){
//    var values = [[
//                  //formObject.username.toString(),
//                  formObject.admin_uname,
//                  formObject.admin_pw]];
//  }else{
//    var values = [[
//                  //new Date().getTime().toString(),//https://webapps.stackexchange.com/a/51012/244121
//                  formObject.admin_uname,
//                  formObject.admin_pw]];
//
//  }
//  return values;
//}
//
//
//
///* CREATE/ APPEND DATA */
//function appendAdminData(values, spreadsheetId,range){
//  var valueRange = Sheets.newRowData();
//  valueRange.values = values;
//  var appendRequest = Sheets.newAppendCellsRequest();
//  appendRequest.adminsheetID = spreadsheetId;
//  appendRequest.rows = valueRange;
//  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
//}
//
//
///* READ DATA */
//function readAdminData(spreadsheetId,range){
//  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
//  return result.values;
//}
//
//
///* UPDATE DATA */
//function updateAdminData(values,spreadsheetId,range){
//  var valueRange = Sheets.newValueRange();
//  valueRange.values = values;
//  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
//  valueInputOption: "RAW"});
//}
//
//
///*DELETE DATA*/
//function deleteAdminData(ID){ 
//  //https://developers.google.com/sheets/api/guides/batchupdate
//  //https://developers.google.com/sheets/api/samples/rowcolumn#delete_rows_or_columns
//  var startIndex = getAdminRowIndexByID(ID);
//  
//  var deleteRange = {
//                      "sheetId"     : globalVariables().adminsheetID,
//                      "dimension"   : "ROWS",
//                      "startIndex"  : startIndex,
//                      "endIndex"    : startIndex+1
//                    }
//  
//  var deleteRequest= [{"deleteDimension":{"range":deleteRange}}];
//  Sheets.Spreadsheets.batchUpdate({"requests": deleteRequest}, globalVariables().spreadsheetId);
//  
//  return getAdminLastTenRows();//Return last 10 rows
//}
//
//
//
///* CHECK FOR EXISTING ID, RETURN BOOLEAN */
//function checkAdminID(ID){
//  var idList = readAdminData(globalVariables().spreadsheetId,globalVariables().adminidRange,).reduce(function(a,b){return a.concat(b);});
//  return idList.includes(ID);
//}
//
//
///* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
//function getAdminRangeByID(id){
//  if(id){
//    var idList = readAdminData(globalVariables().spreadsheetId,globalVariables().adminidRange);
//    for(var i=0;i<idList.length;i++){
//      if(id==idList[i][0]){
//        return 'Admin Data!A'+(i+2)+':'+globalVariables().adminlastCol+(i+2);
//      }
//    }
//  }
//}
//
//
///* GET RECORD BY ID */
//function getAdminRecordById(id){
//  if(id && checkAdminID(id)){
//    var result = readAdminData(globalVariables().spreadsheetId,getAdminRangeByID(id));
//    return result;
//  }
//}
//
//
///* GET ROW NUMBER FOR GIVEN ID */
//function getAdminRowIndexByID(id){
//  if(id){
//    var idList = readAdminData(globalVariables().spreadsheetId,globalVariables().adminidRange);
//    for(var i=0;i<idList.length;i++){
//      if(id==idList[i][0]){
//        var rowIndex = parseInt(i+1);
//        return rowIndex;
//      }
//    }
//  }
//}
//
//
///*GET LAST 10 RECORDS */
//function getAdminLastTenRows(){
//  var lastRow = readAdminData(globalVariables().spreadsheetId,globalVariables().admindataRage).length+1;
//  if(lastRow<=11){
//    var range = globalVariables().admindataRage;
//  }else{
//    var range = 'Admin Data!A'+(lastRow-9)+':'+globalVariables().adminlastCol;
//  }
//  var lastTenRows = readAdminData(globalVariables().spreadsheetId,range);
//  return lastTenRows;
//}
//
//
///* GET ALL RECORDS */
//function getAdminAllData(){
//  var data = readAdminData(globalVariables().spreadsheetId,globalVariables().admindataRage);
//  return data;
//}


/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------FUCNTION FOR RESIDENT CRUD PART-----------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

/* PROCESS FORM */
function processForm(formObject){  
  if(formObject.username && checkID(formObject.username)){//Execute if form passes an ID and if is an existing ID
    updateData(getFormValues(formObject),globalVariables().spreadsheetId,getRangeByID(formObject.username)); // Update Data
  }else{ //Execute if form does not pass an ID
    appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange); //Append Form Data
  }
  return getLastTenRows();//Return last 10 rows
}


/* GET FORM VALUES AS AN ARRAY */
function getFormValues(formObject){
/* ADD OR REMOVE VARIABLES ACCORDING TO YOUR FORM*/
  if(formObject.username && checkID(formObject.username)){
    var values = [[
                  //formObject.username.toString(),
                  formObject.username,
                  formObject.housenumber,
                  formObject.street,
                  formObject.firstname,
                  formObject.lastname,
                  formObject.noOfPaid,
                  formObject.password,
                  formObject.phone]];
  }else{
    var values = [[
                  //new Date().getTime().toString(),//https://webapps.stackexchange.com/a/51012/244121
                  formObject.username,
                  formObject.housenumber,
                  formObject.street,
                  formObject.firstname,
                  formObject.lastname,
                  formObject.noOfPaid,
                  formObject.password,
                  formObject.phone]];

  }
  return values;
}


/* CREATE/ APPEND DATA */
function appendData(values, spreadsheetId,range){
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = spreadsheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
}


/* READ DATA */
function readData(spreadsheetId,range){
  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
  return result.values;
}


/* UPDATE DATA */
function updateData(values,spreadsheetId,range){
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
  valueInputOption: "RAW"});
}


/*DELETE DATA*/
function deleteData(ID){ 
  //https://developers.google.com/sheets/api/guides/batchupdate
  //https://developers.google.com/sheets/api/samples/rowcolumn#delete_rows_or_columns
  var startIndex = getRowIndexByID(ID);
  
  var deleteRange = {
                      "sheetId"     : globalVariables().sheetID,
                      "dimension"   : "ROWS",
                      "startIndex"  : startIndex,
                      "endIndex"    : startIndex+1
                    }
  
  var deleteRequest= [{"deleteDimension":{"range":deleteRange}}];
  Sheets.Spreadsheets.batchUpdate({"requests": deleteRequest}, globalVariables().spreadsheetId);
  
  return getLastTenRows();//Return last 10 rows
}

/* CHECK FOR EXISTING ID, RETURN BOOLEAN */
function checkID(ID){
  var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange,).reduce(function(a,b){return a.concat(b);});
  return idList.includes(ID);
}


/* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
function getRangeByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        return 'USERNAMES!A'+(i+2)+':'+globalVariables().lastCol+(i+2);
      }
    }
  }
}


/* GET RECORD BY ID */
function getRecordById(id){
  if(id && checkID(id)){
    var result = readData(globalVariables().spreadsheetId,getRangeByID(id));
    return result;
  }
}


/* GET ROW NUMBER FOR GIVEN ID */
function getRowIndexByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        var rowIndex = parseInt(i+1);
        return rowIndex;
      }
    }
  }
}


/*GET LAST 10 RECORDS */
function getLastTenRows(){
  var lastRow = readData(globalVariables().spreadsheetId,globalVariables().dataRage).length+1;
  if(lastRow<=11){
    var range = globalVariables().dataRage;
  }else{
    var range = 'USERNAMES!A'+(lastRow-9)+':'+globalVariables().lastCol;
  }
  var lastTenRows = readData(globalVariables().spreadsheetId,range);
  return lastTenRows;
}


/* GET ALL RECORDS */
function getAllData(){
  var data = readData(globalVariables().spreadsheetId,globalVariables().dataRage);
  return data;
}


/*GET DROPDOWN LIST */
function getDropdownList(range){
  var list = readData(globalVariables().spreadsheetId,range);
  return list;
}


//CODE FOR DATA SEARCH
function searchData(formObject){  
  var result = [];
  if(formObject.searchtext){//Execute if form passes search text
      var data = Sheets.Spreadsheets.Values.get(globalVariables().spreadsheetId, globalVariables().dataRage).values;
      for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].length;j++){
          if(data[i][j].toLowerCase().search(formObject.searchtext.toLowerCase())!=-1){
            result.push(data[i])
          }
        }
      }
  }
  return result;
}

//RESET RESIDENT PASSWORD
function admin_resetResPw(username, password){
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var sheet = SpreadsheetApp.openByUrl(url).getSheetByName("USERNAMES");
  var range = sheet.getRange("A2:A").createTextFinder(username).matchEntireCell(true).findNext();
  if (range) {
    range.offset(0,6).setValue(password);
  }
}

//RESET CLERK PASSWORD
function admin_resetClerkPw(clerk_uname, clerk_pw){
  var url = "https://docs.google.com/spreadsheets/d/1bM8l6JefFsPrlJnTWf56wOhnuSjdIwg3hMbY1tN1Zp8/edit#gid=1775459006";
  var sheet = SpreadsheetApp.openByUrl(url).getSheetByName("Clerk Data");
  var range = sheet.getRange("A2:A").createTextFinder(clerk_uname).matchEntireCell(true).findNext();
  if (range) {
    range.offset(0,1).setValue(clerk_pw);
  }
}

/* INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

//function getScriptURL() {
//  var url = "https://athirahsukiman.wixsite.com/website-1/admin";
//  return url ;
//}
