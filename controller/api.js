const path = require('path')

module.exports = function(app,userData){
  // sends the home page
    app.route('/')
      .get(function(req,res){
          res.sendFile(path.join(process.cwd() + '/view/homepage.html'));
          return
      })
      
  // sends the client page 
    app.route('/client')
      .get(function(req,res){
          res.sendFile(path.join(process.cwd() + '/view/client.html'));
          return
      })

  // sends the add client page
    app.route('/add')
      .get(function(req,res){
          res.sendFile(path.join(process.cwd() + '/view/addclient.html'));
          return
      })   

  // route for search client requests
    app.route('/client/search')
      // searches for the clients that match
      .post((req,res)=>{
        // console.log(req.body, 'body');
        // console.log(Object.keys(req.body));
        res.json({data:'sample api response'})
        return
      })
      // get the client data that the user chooses
      .get((req,res)=>{

      })
      // updates the data of the client
      .put((req,res)=>{

      }) 

  // route for add client requests
    app.route('/add/client')  
    // adds the client to the database
      .post((req,res)=>{

        // if successfull
        const newClient = new userData(req.body);
        newClient.profFee = [];
        newClient.save((err,doc)=>{
          if (err) {
            res.json({message: 'Error on saving new client.'});
          }
        res.json({message: 'Client successfully added'});
        })
        
      })         
}
