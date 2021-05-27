window.onload = function () {
  // button for search client page
  const searchClient = document.getElementById('searchClient');

  // button for add client page
  const addClient = document.getElementById('addClient');

  // redirect for /client page
  searchClient.onclick = ()=>{
    location.href = '/client'
  }

  // redirect for /add page
  addClient.onclick = ()=>{
    location.href = '/add'
  }
}