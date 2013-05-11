var app = require('express').createServer();

app.configure(function(){
    app.set('discovery url', 'https://lcbahp.appspot.com/la_cloud_box/updateBoxIp');
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.use('/discovery', require('./services/discovery').application);



// var account_google = require('./services/google/account');
app.use('/google/gmail', require('./services/google/gmail').application);
// app.use('/google/drive', account_google, require('./services/google/drive'));


app.listen(80);