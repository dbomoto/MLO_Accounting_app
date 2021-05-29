window.onload = function() {

  const display = document.getElementById('serverResponse')

  const clientData = document.getElementById('formData');

// Pass the FormData object itself to XMLHttpRequest or fetch. It isn't an object that JSON.stringify can handle.
// https://stackoverflow.com/questions/49801070/formdata-returns-blank-object
  async function searchClient() {
    const form = new FormData(clientData)
    const data = await fetch('/add/client',{
      method: 'POST',
      body: form
    })
    const parsed = await data.json()
    // use 'parsed' to display client data on webpage
    display.innerHTML = `<p>${parsed.message}</p>`;
    setTimeout(()=>{
    display.innerHTML = `<p>Waiting user action.<p>`
    },5000)
  }

  clientData.onsubmit = (e) => {
    e.preventDefault();
    searchClient();
  }
  
}