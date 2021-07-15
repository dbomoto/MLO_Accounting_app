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
      // deletes the client record
      .delete((req,res)=>{
        // console.log(req.query.id)
        userData.deleteOne({_id: req.query.id},function(err,mongooseDeleteResult){
          // console.log(mongooseDeleteResult);
          if (mongooseDeleteResult.deletedCount === 1){
            if (err) {
              res.json({data:'error on server'});
              return;
            }
            // console.log(docs)
            res.json({data:'Client record successfully deleted.'})
            return;
          } else {
            res.json({data:'error on server'})
          }
        })         
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
        // *************** TEST****************
        // $elemMatch is a query-projection operator of the latest MongoDB versions
        if (req.body.summ == 'true'){

          userData.find({profFee:{$elemMatch:{datePaid:'unpaid'}}}, (err,docs)=>{
            if (err) {
              res.json({data:'error on server'});
              return;
            }
            res.json({data:docs})
            return;            
          })
        
        } else {
        // *************** TEST****************      

          // prepare search parameters that adapts to what the user inputs. if no search parameters is given, it will give out all the documents
          const searchObj = {};
          Object.assign(searchObj, req.body);
          delete searchObj.info;
          delete searchObj.summ;
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

        }
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
            // regarding "req.body.index - 1", at this point in time, I did not know that sub-documents will also have their own unique ID's
            doc.profFee[req.body.index - 1] = updateData;
            await doc.save()
            res.json({data:'record updated'});
            return
          })
        }
        
      }) 
      // deletes a record of the client
      .delete((req,res)=>{
        
      })

  // route for add client requests
    app.route('/add/client')
      // displays all the clients currently on the database
      .get((req,res)=>{
        userData.find({},function(err,docs){
          if (err) {
            res.json({data:'error on server'});
            return;
          }
          // console.log(docs)
          res.json({data:docs})
          return;
        })
      })  
      // adds the client to the database
      .post(async (req,res)=>{

          // USE findOne INSTEAD OF exists
          // console.log(req.body, 'request')
         
          // if (await userData.exists({indexNumber: new RegExp(`${req.body.indexNumber}`)})){
          //   console.log('IN exists')
          //   res.json({message: 'Client already exists', refresh: false});
          //   return            
          // } else {
          //   console.log('IN is unique')


          //  indexNumber must be unique; firstName, lastName, companyName altogether must be unique.
          // confirm first if indexNumber already exists
          userData.findOne({indexNumber: req.body.indexNumber},(err,doc)=>{
            if (doc) {
              res.json({message: 'Index Number already used.', refresh: false});
              return 
            } else {
              // confirm is client already exists on the database excluding index#
              userData.findOne({
                firstName: req.body.firstName, 
                lastName: req.body.lastName, 
                companyName: req.body.companyName
              },(err,doc2)=>{
                if (doc2) {
                  res.json({message: 'Client already exists', refresh: false});
                  return
                } else {
                  // if client is not repeated
                  const newClient = new userData(req.body);
                  newClient.profFee = [{
                    month: 'January',
                    year: 2000,
                    amount: 0,
                    datePaid: 'unpaid'          
                  }];
                  newClient.save((err,doc)=>{
                    if (err) {
                      res.json({message: 'Error on saving new client.'});
                      return
                    }
                  res.json({message: 'Client successfully added', refresh: true});
                  return
                  })            
                }
              })
            }
          })

          // }
        
      })
      // updated request on the modal of edit client metadata 
      .put((req,res)=>{
            // console.log(req.body, 'request body')
        
        
        userData.findById(req.body.clientID,(err,docOriginal)=>{
          // if user want to change the index Number
          if(`${docOriginal.indexNumber}`.localeCompare(req.body.clientIN) != 0){
            // check if user input of index number is unique
            userData.findOne({indexNumber: req.body.clientIN}, (err,doc)=>{
              if (doc) {
                res.json({message: 'Index number already used', refresh: false});
                return                  
              } else {
                
                // check if client exists
                userData.findOne({                  
                  firstName: req.body.clientFN, 
                  lastName: req.body.clientLN, 
                  companyName: req.body.clientCN
                },(err,doc)=>{
                  if (doc) {

                    userData.findByIdAndUpdate(req.body.clientID, {
                      $set: {
                        indexNumber: req.body.clientIN,
                        firstName: req.body.clientFN,
                        lastName: req.body.clientLN,
                        companyName: req.body.clientCN          
                      }
                    },(err,doc)=>{
                      if (err) {
                          res.json({message: 'Error on saving new client.'});
                        }
                      res.json({message: 'Client record succesfully updated.', refresh: true})   
                    }
                  )                     
                    // res.json({message: 'Client already exists', refresh: false});
                    // return 

                  } else {
                  
                    userData.findByIdAndUpdate(req.body.clientID, {
                      $set: {
                        indexNumber: req.body.clientIN,
                        firstName: req.body.clientFN,
                        lastName: req.body.clientLN,
                        companyName: req.body.clientCN          
                      }
                    },(err,doc)=>{
                      if (err) {
                          res.json({message: 'Error on saving new client.'});
                        }
                      res.json({message: 'Client record succesfully updated.', refresh: true})   
                    }
                  )    
                             
                  }             
                }) 
                
              }
            })
          } else {
          // use current indexNumber
          // check if client exists
            userData.findOne({
              firstName: req.body.clientFN, 
              lastName: req.body.clientLN, 
              companyName: req.body.clientCN
            },(err,doc)=>{
              if (doc) {
                res.json({message: 'No changes on current record', refresh: false});
                return                 
              } else {
                userData.findByIdAndUpdate(req.body.clientID, {
                  $set: {
                    firstName: req.body.clientFN,
                    lastName: req.body.clientLN,
                    companyName: req.body.clientCN            
                  }
                },(err,doc)=>{
                  if (err) {
                      res.json({message: 'Error on saving new client.'});
                    }
                  res.json({message: 'Client record succesfully updated.', refresh: true})   
                }
               )                                                
              }             
            })
          }
        })




            // confirm is client already exists on the database excluding index#
            // userData.findOne({
            //     firstName: req.body.clientFN, 
            //     lastName: req.body.clientLN, 
            //     companyName: req.body.clientCN
            //   },(err,doc)=>{
            //     // console.log(`${doc.indexNumber}`.localeCompare(req.body.clientIN))
            //     // console.log(doc.indexNumber,req.body.clientIN)
            //     console.log(doc,'doc visiblity 1')
            //     if (doc) {
            //       res.json({message: 'Client already exists', refresh: false});
            //       return                   
            //     } else {
            //       // disregard if index input is unchanged
            //       console.log(doc,'doc visiblity 2')
            //       if ((`${doc.indexNumber}`.localeCompare(req.body.clientIN)) != 0){
            //         // user wants to change indexNumber
            //         // confirm first if indexNumber already exists
            //         userData.findOne({
            //           indexNumber: req.body.clientIN
            //         }, (err,doc2)=>{
            //               if (doc2) {
            //                 res.json({message: 'Index Number already used.', refresh: false});
            //                 return 
            //               } else {
            //                 userData.findByIdAndUpdate(req.body.clientID, {
            //                     $set: {
            //                       indexNumber: req.body.clientIN,
            //                       firstName: req.body.clientFN,
            //                       lastName: req.body.clientLN,
            //                       companyName: req.body.clientCN            
            //                     }
            //                   },(err,doc)=>{
            //                     if (err) {
            //                         res.json({message: 'Error on saving new client.'});
            //                         return
            //                       }
            //                     res.json({
            //                       message: 'Client record succesfully updated.', refresh: true})   
            //                       return
            //                 })                        
            //               }
            //           })         

            //       }else{
            //         // indexNumber was not changed by user
            //         userData.findByIdAndUpdate(req.body.clientID, {
            //             $set: {
            //               indexNumber: req.body.clientIN,
            //               firstName: req.body.clientFN,
            //               lastName: req.body.clientLN,
            //               companyName: req.body.clientCN            
            //             }
            //           },(err,doc)=>{
            //             if (err) {
            //                 res.json({message: 'Error on saving new client.'});
            //                 return
            //               }
            //             res.json({
            //               message: 'Client record succesfully updated.', refresh: true})   
            //               return
            //         })
            //       }
            //     }
            //     })
      })  

          // }
        // })


        // }

      // WORKING CODE
      //   userData.findByIdAndUpdate(req.body.clientID, {
      //     $set: {
      //       indexNumber: req.body.clientIN,
      //       firstName: req.body.clientFN,
      //       lastName: req.body.clientLN,
      //       companyName: req.body.clientCN            
      //     }
      //   },(err,doc)=>{
      //     if (err) {
      //         res.json({message: 'Error on saving new client.'});
      //       }
      //     res.json({
      //       message: 'Client record succesfully changed to:',
      //       indexNumber: req.body.clientIN,
      //       firstName: req.body.clientFN,
      //       lastName: req.body.clientLN,
      //       companyName: req.body.clientCN
      //     })   
      //   }
      //  )

      // })          
}
