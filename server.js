// environment variable
require('dotenv').config();

// from npm
const express = require('express');
const mongoose = require('mongoose');



// from local
const apiRoutes = require('./routes/api.js');



let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

// dbName: process.env.DB_NAME,
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(()=>{
    console.log('database connected.')

    const Schema = mongoose.Schema;

    const userDataSchema = new Schema({
       firstName: String,
       lastName: String,
       companyName: String,
       profFee: [String], 
    })

    const userData = mongoose.model('mloClients', userDataSchema);

    apiRoutes(app,userData)

    app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port " + process.env.PORT);
      });    

}).catch((err) => console.log(err.message))