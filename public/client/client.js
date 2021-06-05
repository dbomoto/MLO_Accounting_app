
  const display = document.getElementById('dataOutput');

  const submitSearch = document.getElementById('formData');

// Pass the FormData object itself to XMLHttpRequest or fetch. It isn't an object that JSON.stringify can handle.
// https://stackoverflow.com/questions/49801070/formdata-returns-blank-object

// searches database for matching user querie
  async function searchClient() {
    const form = new FormData(submitSearch)
    const dataClient = await fetch('/client/search',{
      method: 'POST',
      body: form
    })

    // use 'parsed' to display response on webpage
    const parsed = await dataClient.json();
    // needs to be let declaration in order for it to be reassigned to other values
    let clientList = '';
    const parsedData = parsed.data;
    // console.log(parsedData)
    for (const temp of parsedData){
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

// get document from database and display it
  async function viewDetails(id){
    // alert('successfully called');
    // alert(id);
    const dataClient = await fetch(`/client/search?id=${id}`)
    const parsed = await dataClient.json();
    let summary = '';
    let total = 0;
    const {indexNumber} = parsed;
    const {firstName} = parsed;
    const {lastName} = parsed;
    const {companyName} = parsed;
    const {profFee} = parsed;

    // set output format for display
    for(let temp of profFee){
      let profFeeData = temp.split(":");
      total += parseInt(profFeeData[2]);
      summary += `
      <tr>
        <td>${profFeeData[0]}</td>
        <td>${profFeeData[1]}</td>
        <td>${profFeeData[2]}</td>
      </tr>
      `
    }
    summary += `
    <tr>
      <td colspan="2">TOTAL</td>
      <td>${total}</td>
    </tr>
    `

    // display client data on browser
    display.innerHTML = `<table>
    <caption>${indexNumber} ${firstName} ${lastName} ${companyName}</caption>
      <tr>
        <th colspan="3">Professional Fee</th>
      </tr>   
      <tr>
        <th>Month</th>
        <th>Year</th>
        <th>Amount</th>
      </tr>   
      ${summary}
    </table>`    
  }

