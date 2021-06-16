// MODAL SECTION
const toggleButton = document.getElementById('modal-toggle')
const modalTitle = document.getElementById('modalTitle')
const modalContent = document.getElementById('modalContent')


const display = document.getElementById('dataOutput');

const submitSearch = document.getElementById('formData');

// for blank records
const blankData = {
  month: 'January',
  year: 2000,
  amount: 0,
  datePaid: 'new record'
}

// for record update
let editData = {
  index: 0,
  month: 'January',
  year: 2000,
  amount: 0,
  datePaid: 'n/a'
}

// Pass the FormData object itself to XMLHttpRequest or fetch. It isn't an object that JSON.stringify can handle.
// https://stackoverflow.com/questions/49801070/formdata-returns-blank-object

// searches database for matching user querie
async function searchClient() {
  const form = new FormData(submitSearch)
  form.append('summ','false')
  const dataClient = await fetch('/client/search', {
    method: 'POST',
    body: form
  })

  // use 'parsed' to display response on webpage
  const parsed = await dataClient.json();
  // needs to be let declaration in order for it to be reassigned to other values
  let clientList = '';
  const parsedData = parsed.data;
  // console.log(parsedData)
  for (const temp of parsedData) {
    // use temp._id as the reference for that document to be used when user chooses that document. take note of double quotes and single quotes on the onlcick event in order to pass the value as text.
    clientList += `
      <tr>
        <td>${temp.indexNumber}</td>
        <td>${temp.firstName}</td>
        <td>${temp.lastName}</td>
        <td>${temp.companyName}</td>
        <td><input type="button" value="VIEW DETAILS" onclick="viewDetails('${temp._id}')"></td>
      </tr>
      `
  }
  // console.log(clientList)

  // console.log(parsed.data)
  display.innerHTML = `<table>
    <caption>MATCHED RECORDS</caption>
      <tr>
        <th>Index Number</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Company Name</th>
        <th>Commands</th>
      </tr>
      ${clientList}
    </table>`
}

// replace default action of submit in form
submitSearch.onsubmit = (e) => {
  e.preventDefault();
  searchClient();
}


// browser cannot identify function viewDetails when inside the onload event, must be declared outside

// get document from database and display it with commands
async function viewDetails(id) {
  // alert('successfully called');
  // alert(id);
  const dataClient = await fetch(`/client/search?id=${id}`)
  const parsed = await dataClient.json();
  let summary = '';
  let total = 0;
  let editableData;
  const { _id } = parsed;
  const { indexNumber } = parsed;
  const { firstName } = parsed;
  const { lastName } = parsed;
  const { companyName } = parsed;
  const { profFee } = parsed;

  // set output format for display; MONTH, YEAR, AMOUNT, DATE PAID, COMMANDS
  for (let i = 0; i < profFee.length; i++) {
    total += profFee[i].amount;
    editableData = JSON.stringify(profFee[i]);
    summary += `
        <tr>
          <td>${profFee[i].month}</td>
          <td>${profFee[i].year}</td>
          <td>${profFee[i].datePaid}</td>
          <td>${profFee[i].amount}</td>
          <td><input type="button" value="EDIT" onclick="showProfFeeRec('${i + 1}',{
            id:'${_id}',
            month:'${profFee[i].month}',
            year:'${profFee[i].year}',
            datePaid:'${profFee[i].datePaid}',
            amount:'${profFee[i].amount}'
          })"></td>
        </tr>
        `
        // take note, in the scenario of "summary" above, you cannot set an argument that is an object with declared within the function, you have to manually make the object in order for it to be passed and do not set it as string
  }

  summary += `
    <tr>
      <td colspan="3">TOTAL</td>
      <td>${total}</td>
    </tr>
    `

  // display client data on browser
  display.innerHTML = `<table>
    <caption>${indexNumber} ${firstName} ${lastName} ${companyName}</caption>
      <tr>
        <th colspan="5">Professional Fee</th>
      </tr>   
      <tr>
        <th>Month</th>
        <th>Year</th>
        <th>Date Paid</th>
        <th>Amount</th>
        <th>Commands</th>
      </tr>   
      ${summary}
    </table>
    <input type="button" value="ADD RECORD" id="addProfFeeRec" onclick="addProfFeeRec('${_id}',blankData,true)">`
  // take note, blankData is referencing the variable declared on the js file. ${_id} is referencing the id from the fetch and assigned inside the function where it was declared
}

// add a blank section of record ready for edit by the user
async function addProfFeeRec(id, update, newRec) {
  // use the formData argument to pass in the values
  const formData = new FormData();
  // if newRec is true, indicates a new record, else edit record
  if (newRec) {
    formData.append('id', id);
    formData.append('newRec', newRec);
    formData.append('month', update.month);
    formData.append('year', update.year);
    formData.append('amount', update.amount);
    formData.append('datePaid', update.datePaid);
  } else {
    formData.append('id', id);
    formData.append('newRec', newRec);
    formData.append('index', update.index);
    formData.append('month', update.month);
    formData.append('year', update.year);
    formData.append('amount', update.amount);
    formData.append('datePaid', update.datePaid);
  }

  const dataClient = await fetch('/client/search', {
    method: 'PUT',
    body: formData
  })
    const parsed = await dataClient.json();
    alert(parsed.data);
    viewDetails(id);    

}

// MODAL SECTION
// when update is clicked, send the form data and call function
function showProfFeeRec(recordIndex, recordData) {
  // const newRec = {};
  // Object.assign(newRec,recordData);
  // const newRecIndex = recordIndex;
  editData = {
    index: recordIndex,
    month: recordData.month,
    year: recordData.year,
    amount: recordData.amount,
    datePaid: recordData.datePaid
  }
  editData.index = recordIndex;

  toggleButton.checked = true;
  modalTitle.innerHTML = `Update Record`;
  modalContent.innerHTML = `
  <form class="defaultForm" id="editFormData">
    <label for="recId">Client ID:</label>
    <input type="text" value=${recordData.id} id="recId" for="recId" readonly> 
    <label for="index">Record No:</label>
    <input type="text" value=${recordIndex} id="index" for="index" readonly>
    <label for="month">Month</label>
    <input type="text" value=${recordData.month} id="month" oninput="editFormData(this.value,'month')" name="month>
    <label for="year">Year</label>
    <input type="text" value=${recordData.year} id="year" oninput="editFormData(this.value,'year')" name="year>  
    <label for="datePaid">Date Paid</label>
    <input type="text" value=${recordData.datePaid} id="datePaid" oninput="editFormData(this.value,'datePaid')" name="datePaid">
    <label for="amount">Amount</label>
    <input type="text" value=${recordData.amount} id="amount" oninput="editFormData(this.value,'amount')" name="amount">
  </form>
    <label class="modal-close button" for="modal-toggle">CLOSE</label>
    <label class="modal-close button2" for="modal-toggle" onclick="addProfFeeRec('${recordData.id}', {
    index: '${recordIndex}',
    month: editData.month,
    year: editData.year,
    datePaid: editData.datePaid,
    amount: editData.amount
  }, false)">UPDATE</label>    
  `
  // the last two labels are for modal controls
}

// changes the global variable editData, and ready 
function editFormData(value,name){
  editData[name] = value;
}


// SUMMARY SECTION
// this function will display all clients with pending payments
function summary(){
  const form = new FormData()
  form.append('summ','true')
  // const dataClient = await fetch('/client/search', {
  //   method: 'POST',
  //   body: form
  // })
  // const parsed = await dataClient.json();
  // const { summary } = parsed.data

  new gridjs.Grid({
    columns: [{name: 'ID',hidden: true},'Index','Client Name','Company Name',{
      name: 'Commands',
        formatter: (cell, row) => {
          return `<button>test</button>`;
        }     
    } ],
    server: {
      url: '/client/search',
      method: 'POST',
      body: form,
      then: srvRes => srvRes.data.map(clnt=>[clnt._id,clnt.indexNumber,clnt.firstName + " " + clnt.lastName,clnt.companyName]),
      handle: (res) => {
      // no matching records found
      if (res.status === 404) return {data: []};
      if (res.ok) return res.json();
      
      throw Error('Server or database error. Please contact admin.');
      }
    }
  }).render(document.getElementById("summary"));
}

summary();



