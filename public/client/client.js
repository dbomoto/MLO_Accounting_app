window.onload = function() {

  const display = document.getElementById('dataOutput');

  const submitSearch = document.getElementById('formData');

// Pass the FormData object itself to XMLHttpRequest or fetch. It isn't an object that JSON.stringify can handle.
// https://stackoverflow.com/questions/49801070/formdata-returns-blank-object
  async function searchClient() {
    const form = new FormData(submitSearch)
    const dataClient = await fetch('/client/search',{
      method: 'POST',
      body: form
    })

    // use 'parsed' to display response on webpage
    const parsed = await dataClient.json();
    const clientList = '';
    const parsedData = parsed.data;
    console.log(parsedData)
    for (const temp of parsedData){
      clientList += `<tr>
        <td>${temp.indexNumber}</td>
        <td>${temp.firstName}</td>
        <td>${temp.lastName}</td>
        <td>${temp.companyName}</td>
      </tr>`
    }
    console.log(clientList)

    // console.log(parsed.data)
    // display.innerHTML = `<table>
    // <caption>MATCHED RECORDS</caption>
    //   <tr>
    //     <th>Index Number</th>
    //     <th>First Name</th>
    //     <th>Last Name</th>
    //     <th>Company Name</th>
    //   </tr>
    //   ${clientList}
    // </table>`
  }

  submitSearch.onsubmit = (e) => {
    e.preventDefault();
    searchClient();
  }

}
