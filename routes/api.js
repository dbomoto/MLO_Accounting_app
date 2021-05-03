module.exports = function(app,userData){
    app.route('/')
        .get(function(req,res){
            res.sendFile('./view/index.html');
            return
        })
}

//             res.sendFile('/view/index.html',{root:__dirname});