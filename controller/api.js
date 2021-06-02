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

        // prepare search parameters that adapts to what the user inputs.
        const searchObj = {};
        Object.assign(searchObj, req.body);
        delete searchObj.info;
        for (const prop in searchObj){
          if (searchObj[prop] === ""){
            delete searchObj[prop];
          }
        }

        // search database using parameters given by user
        userData.find(searchObj,function(err,docs){
          if (err) {
            res.json({data:'error on server'});
            return;
          }
          // console.log(docs)
          res.json({data:docs})
          return;
        })

        // console.log(req.body, 'body');
        // console.log(Object.keys(req.body));
        // res.json({data:'sample api response'})
        // return
      })
      // get the client data that the user chooses
      .get((req,res)=>{
        // console.log(req.query)
        userData.find(req.query.id,function(err,doc){
          if (err) {
            res.json({data:'error on server'});
            return;
          }
          // console.log(docs)
          res.json({data:doc})
          return;
        })        
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
