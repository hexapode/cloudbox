var app = require('express').createServer();

app.get('/', function (req, res) {
	res.send('google/gmail root');
});

app.get('/create', function (req, res) {
	res.render('google-gmail-create');
});


module.exports = {
	application: app
};