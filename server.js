// external modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const multer = require('multer');


// local modules
const apiRoutes = require('./controller/api.js');

// load multer on app
let upload = multer();
// load express on app
let app = express();

// for parsing application/json
// app.use(bodyParser.json()); 
// for parsing application/xwww-;form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing multipart/form-data
// app.use(upload.array()); 

// public declarations
app.use('/public', express.static(process.cwd() + '/public'));

// loading middlewares
// for parsing multipart/form-data
app.use(upload.array()); 

// connection to database
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(()=>{
    console.log('database connected.')

    // Mongoose Schema Setting
    const Schema = mongoose.Schema;
    const userDataSchema = new Schema({
       indexNumber: String,
       firstName: String,
       lastName: String,
       companyName: String,
       profFee: [{
        month: {type:String},
        year: {type:String},
        amount: {type:Number},
        datePaid: {type:String}
       }] 
    })
    const userData = mongoose.model('mloClients', userDataSchema);

    // loading local modules into app
    apiRoutes(app,userData)

    //404 Not Found Middleware
    app.use(function(req, res, next) {
        res.status(404)
          .type('text')
          .send('Not Found, but app is running');
      });    

    // make the app listen
    app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port " + process.env.PORT);
      });    

}).catch((err) => console.log(err.message))