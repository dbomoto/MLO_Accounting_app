const path = require('path')

module.exports = function(app,userData){
    app.route('/')
      .get(function(req,res){
          res.sendFile(path.join(process.cwd() + '/view/homepage.html'));
          return
      })
    
    app.route('/client')
      .post((req,res)=>{
        // console.log(req.body, 'body');
        // console.log(Object.keys(req.body));
        res.json({data:'sample api response'})
        return
      })
}
