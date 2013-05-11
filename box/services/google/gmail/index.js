var app = require('express').createServer();

app.get('/', function (req, res) {
	res.send('google/gmail root');
});


module.exports = {
	application: app
};