window.onload = function() {

  const display = document.getElementById('dataOutput');

  async function searchClient() {
    const form = new FormData(document.getElementById('formData'))
    const data = await fetch('/client',{
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify(form)
    })
    const parsed = await data.json()
    // use 'parsed' to display client data on webpage
    display.innerHTML = `<p>${parsed.data}</p>`
  }

  document.getElementById("submitSearch").addEventListener("click", function(event){event.preventDefault()});

  document.getElementById("submitSearch").addEventListener("click", searchClient);

}
