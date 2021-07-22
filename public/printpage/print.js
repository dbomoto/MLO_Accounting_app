const clientName = document.getElementById("clientName");
const records = document.getElementById("clientRecords");
let docTitle = "";

// loads id to clientID for use later and immediately delete session storage for security purposes
var clientID = sessionStorage.getItem("clientID")
sessionStorage.removeItem("clientID");
sessionStorage.clear();

async function getData(){
  const dataClient = await fetch(`/print?id=${clientID}&need=meta`)
  const parsed = await dataClient.json();

  docTitle = `${parsed.indexNumber} ${parsed.firstName} ${parsed.lastName} ${(new Date()).toDateString()}`

  clientName.innerHTML = `
  <span class="text-lg font-semibold">${parsed.indexNumber} ${parsed.firstName} ${parsed.lastName}</span>
  <span class="text-lg font-semibold">${parsed.companyName}</span>
  `
// console.log(parsed.data)
}

function getRecords(){
new gridjs.Grid({
      columns: [
        'For the period of',
        'Amount',
      ],
      server: {
        url: `/print?id=${clientID}&need=record`,
        method: 'GET',
        then: srvRes => srvRes.data.map(clnt=>[
          `${clnt.month} ${clnt.year}`, clnt.amount
        ]),
        handle: (res) => {
        // no matching records found
        if (res.status === 404) return {data: []};
        if (res.ok) return res.json();
        
        throw Error('Server or database error. Please contact admin.')
        }      
      },
      fixedHeader: true,
      height: '300px'
  }).render(document.getElementById("clientRecords"));
}

window.onload = function(){
getRecords();
getData();
}

// console.log(clientID)

