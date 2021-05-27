window.onload = function() {

  const display = document.getElementById('dataOutput');

  const submitSearch = document.getElementById('formData');

// Pass the FormData object itself to XMLHttpRequest or fetch. It isn't an object that JSON.stringify can handle.
// https://stackoverflow.com/questions/49801070/formdata-returns-blank-object
  async function searchClient() {
    const form = new FormData(submitSearch)
    const data = await fetch('/client/search',{
      method: 'POST',
      body: form
    })
    const parsed = await data.json()
    // use 'parsed' to display client data on webpage
    display.innerHTML = `<p>${parsed.data}</p>`
  }

  submitSearch.onsubmit = (e) => {
    e.preventDefault();
    searchClient();
  }

}
