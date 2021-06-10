// MODAL SECTION
const toggleButton = document.getElementById('modal-toggle')
const modalTitle = document.getElementById('modalTitle')
const modalContent = document.getElementById('modalContent')


const display = document.getElementById('dataOutput');

const submitSearch = document.getElementById('formData');

const blankData = {
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

  // set output format for display; MONTH, YEAR, AMOUNT, DATE PAID, EDIT RECORD, SAVE RECORD
  for (let i = 0; i < profFee.length; i++) {
    total += profFee[i].amount;
    editableData = JSON.stringify(profFee[i]);
    summary += `
        <tr>
          <td>${profFee[i].month}</td>
          <td>${profFee[i].year}</td>
          <td>${profFee[i].datePaid}</td>
          <td>${profFee[i].amount}</td>
          <td><input type="button" value="EDIT" onclick="editProfFeeRec('${i + 1}',{
            month:'${profFee[i].month}',
            year:'${profFee[i].year}',
            datePaid:'${profFee[i].datePaid}',
            amount:'${profFee[i].amount}'
          })"></td>
        </tr>
        `
        // take note, in the scenario of "summary" above, you cannot set an argument that is an object with declared within the function, you have to manually make the object in order for it to be passed
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
    <input type="button" value="ADD RECORD" id="addProfFeeRec" onclick="addProfFeeRec('${_id}',blankData)">`
  // take note, blankData is referencing the variable declared on the js file. ${_id} is referencing the id from the fetch and assigned inside the function where it was declared
}

// add a blank section of record ready for edit by the user
async function addProfFeeRec(id, update) {
  // use the formData argument to pass in the values
  const formData = new FormData();
  formData.append('id', id);
  formData.append('month', update.month);
  formData.append('year', update.year);
  formData.append('amount', update.amount);
  formData.append('datePaid', update.datePaid);

  const dataClient = await fetch('/client/search', {
    method: 'PUT',
    body: formData
  })

  const parsed = await dataClient.json();
  alert(parsed.data);
  viewDetails(id);
}

// MODAL SECTION
async function editProfFeeRec(recordIndex, recordData) {

  toggleButton.checked = true;
  modalTitle.innerHTML = `Record No: ${recordIndex}`;
  modalContent.innerHTML = `
  <form class="defaultForm">
    <label for="month">Month</label>
    <input type="input" value=${recordData.month} id="month" name="month>

    <label for="year">Year</label>
    <input type="input" value=${recordData.year} id="year" name="year>  

    <label for="datePaid">Date Paid</label>
    <input type="input" value=${recordData.datePaid} id="datePaid" name="datePaid">

    <label for="amount">Amount</label>
    <input type="input" value=${recordData.amount} id="amount" name="amount">        
  </form>
  `;
}





