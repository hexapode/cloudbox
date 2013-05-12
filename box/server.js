var _express = require('express');

var app = _express.createServer();

app.configure(function(){
	app.set('cloudbox name', process.env.CLOUDBOX_NAME || 'AngelHack');

	app.set('discovery url', 'https://lcbahp.appspot.com/la_cloud_box/updateBoxIp');
	app.set('discovery interface', process.env.CLOUDBOX_INTERFACE || 'eth0');

	app.set('view options', {
		layout: false
	});

	app.set('views', __dirname+'/template');
//	app.set('view engine', __dirname+'/template');
	app.set('view engine', 'hbs');
});

app.use('/js', _express.static(__dirname + '/js'));
app.use('/css', _express.static(__dirname + '/css'));
app.use('/img', _express.static(__dirname + '/img'));

app.get('/', function(req, res){
  res.render('home');
});

var _services_discovery = require('./services/discovery');

app.use('/discovery', _services_discovery.application);

// var account_google = require('./services/google/account');
app.use('/google/gmail', require('./services/google/gmail').application);
// app.use('/google/drive', account_google, require('./services/google/drive'));


app.listen(80);

setTimeout(function () {
	_services_discovery.api.requestDiscovery(function () {
		console.log('discovery...ok');
	});
}, 5000);
