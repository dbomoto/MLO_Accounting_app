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

  // route for client requests
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
        userData.findById(req.query.id,function(err,doc){
          if (err) {
            res.json({data:'error on server'});
            return;
          }
          // console.log(docs)
          res.json(doc)
          return;
        })        
      })
      // updates the data of the client; only prof fee for now
      .put((req,res)=>{
        // res.json({data:req.body.month})
        // cannot pass in boolean values to server
        // console.log(req.body)
        if (req.body.newRec === 'true'){
          userData.findById(req.body.id, async (err,doc)=>{
            if (err) {
              res.json({data:'error on server'});
              return;
            }          
            // console.log(doc)
            const updateData = {};
            Object.assign(updateData,req.body);
            delete updateData.id;
            delete updateData.newRec;
            doc.profFee.push(updateData);
            await doc.save()
            res.json({data:'new blank record added'});
            return
          })
        } else {
          userData.findById(req.body.id, async (err,doc)=>{
            if (err) {
              res.json({data:'error on server'});
              return;
            }          
            // console.log(doc)
            const updateData = {};
            Object.assign(updateData,req.body);
            delete updateData.id;
            delete updateData.newRec;
            delete updateData.index
            doc.profFee[req.body.index - 1] = updateData;
            await doc.save()
            res.json({data:'record updated'});
            return
          })
        }
        
      }) 
      // deletes the data of the client
      .delete((req,res)=>{
        
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
