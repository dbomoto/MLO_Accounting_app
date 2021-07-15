window.onload = function() {

  clientData.onsubmit = (e) => {
    e.preventDefault();
    searchClient();
  }

  displayClients();
  // displayModal();

}

  const display = document.getElementById('serverResponse');
  const clientData = document.getElementById('formData');
  const toggleButton = document.getElementById('modal-toggle');
  const clientDataContainer = document.getElementById('clientDataContainer');

// Pass the FormData object itself to XMLHttpRequest or fetch. It isn't an object that JSON.stringify can handle.
// https://stackoverflow.com/questions/49801070/formdata-returns-blank-object
  async function searchClient() {
    const form = new FormData(clientData)
    const data = await fetch('/add/client',{
      method: 'POST',
      body: form
    })
    const parsed = await data.json()
    alert(parsed.message);
    // use 'parsed' to display client data on webpage
    // display.innerHTML = `<p>${parsed.message}</p>`;
    // setTimeout(()=>{
    // display.innerHTML = `<p>Waiting user action.<p>`
    // },5000)

    // refreshe the table of clients depending on result
    if (parsed.refresh) {
      await removeAllChildNodes(clientDataContainer,'clientData');
      await displayClients();
    }
  }

// displays all the clients currently on the database
  async function displayClients() { 
    // reset ***
    // const tagModal = document.getElementById("modal-container");
    // tagModal.classList.remove("toggleDisplayModal")  
    // *** reset

    new gridjs.Grid({
      columns: [
        {
          name: 'reference',
          hidden: true
        },
        'Index Number',
        'First Name',
        'Last Name',
        'Company Name',
        {
          name: 'Commands',
          formatter: (cell, row) => {
            return gridjs.h('button', {
              className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600',
              onClick: () => editClient([row.cells[0].data,row.cells[1].data,row.cells[2].data,row.cells[3].data,row.cells[4].data])
            }, 'Edit Client Data')          
          },
          sort: false
        }  
        ],
      server: {
        url: `/add/client`,
        method: 'GET',
        // body: form,
        then: srvRes => srvRes.data.map(clnt=>[clnt._id,clnt.indexNumber,clnt.firstName,clnt.lastName,clnt.companyName]),
        handle: (res) => {
        // no matching records found
        if (res.status === 404) return {data: []};
        if (res.ok) return res.json();
        
        throw Error('Server or database error. Please contact admin.');
        }    
      },
      pagination:{
        enabled: true,
        limit: 5
      },
      sort: true   
    }).render(document.getElementById('clientData'));
  };

// displays the modal, and inputs for editing data.
  async function editClient(rowData){

    // console.log(rowData)

    const clientID = rowData[0];
    const clientIN = rowData[1];
    const clientFN = rowData[2];
    const clientLN = rowData[3];
    const clientCN = rowData[4];

    // console.log(clientID,clientIN,clientFN,clientLN,clientCN)
    // correct here

    await displayModal();

    // const dataClient = await fetch('/client/search', {
    //   method: 'POST',
    //   body: form
    // })

    // const parsed = await dataClient.json();


    // take note of the value attributes on the inputs; it must have '' or "" in order to accomodate all the text in that variable, otherwise, if your text has spaces, it will only show the first complete word.
    toggleButton.checked = true;
    modalTitle.innerHTML = `Update Client MetaData`;
    modalContent.innerHTML =  `
    <form class="defaultForm" id="editFormData">

      <label for="clientID">Client ID:</label>
      <input type="text" value='${clientID}' id="clientID" for="clientID" name="clientID" readonly> 

      <label for="clientIN">Index No:</label>
      <input type="text" id="clientIN" for="clientIN" name="clientIN" value='${clientIN}'>    

      <label for="clientFN">First Name</label>
      <input type="text" value='${clientFN}' id="clientFN" for="clientFN" name="clientFN">

      <label for="clientLN">Last Name</label>
      <input type="text" value='${clientLN}' id="clientLN" for="clientLN" name="clientLN">
    
      <label for="clientCN">Company Name</label>
      <input type="text" value='${clientCN}' id="clientCN" for="clientCN" name="clientCN">

    </form>
    
    <label class="modal-close button" for="modal-toggle">CLOSE</label>
    <label class="modal-close button2" for="modal-toggle" onclick="updateMetaData(
    new FormData(document.getElementById('editFormData'))
    )">UPDATE</label>    
    `

  }

// call this whenever a grid needed to be refreshed
function removeAllChildNodes(parent,id) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    let div = document.createElement("DIV");
    div.setAttribute('id', id);
    parent.appendChild(div);
}

// this is used to toggle the Modal on/off since it is still clickable if present on the HTML
async function displayModal() {
  // console.log('here');
  const tagModal = document.getElementById("modal-container");
  await tagModal.classList.toggle("toggleDisplayModal")
}

// sends a request to update the chosen client metadata 
async function updateMetaData(inputData) {
    // closes the modal
    // await displayModal() 

  // console.log(id,inputData.get('clientFN'))
    // const clientID = inputData.get('clientID');
    // const clientIN = inputData.get('clientIN');
    // const clientFN = inputData.get('clientFN');
    // const clientLN = inputData.get('clientLN');
    // const clientCN = inputData.get('clientCN');

    // console.log(clientID,clientIN,clientFN,clientLN,clientCN)


  // inputData is already in form formatter, pass it immediately
    const dataClient = await fetch('/add/client', {
      method: 'PUT',
      body: inputData
    })
    const parsed = await dataClient.json();  
    
    alert(parsed.message);

    // refreshe the table of clients depending on result
    if (parsed.refresh) {
      // needed for gridjs to refresh
      await removeAllChildNodes(clientDataContainer,'clientData');
      // call this, to refresh the current client list
      await displayClients();       
    }
   
}