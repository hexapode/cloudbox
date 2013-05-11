var _http = require('http');
var _url = require('url');

var app = require('express').createServer();

app.get('/', function (req, res) {
	res.send('discovery root');
});

app.get('/ping', function (req, res) {
	var url = app.set('discovery url');
	var parts = _url.parse(url);

	var message = {};

	var q = http.request({
		host: parts.host,
		port: parts.port,
		path: parts.path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	q.write(JSON.stringify(message));
	q.end();
	// https://lcbahp.appspot.com/la_cloud_box/updateBoxIp?boxName=Artemis&boxIp=172.16.54.30

	res.send('discovery root');


});

module.exports = {
	application: app
};