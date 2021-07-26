window.onload = function () {
  // button for search client page
  const searchClientHP = document.getElementById('searchClient');

  // button for add client page
  const addClient = document.getElementById('addClient');

  const home = document.getElementById('homepage');

  // redirect for /client page
  searchClientHP.onclick = ()=>{
    location.href = '/client'
  }

  // redirect for /add page
  addClient.onclick = ()=>{
    location.href = '/add'
  }

  home.onclick = ()=>{
    location.href = '/'
  }
}