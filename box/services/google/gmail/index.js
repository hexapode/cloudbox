var	app = require('express').createServer();
var	imap = require('./ImapInstance.js');


app.get('/', function (req, res, next) {
	res.send('google/gmail root');
});


app.get('/backup', function (req, res) {
	var account = {
		user: 'spouwny.test@gmail.com',
		password: 'kitkatkodac',
		host: 'imap.gmail.com',
		port: 993,
		secure: true
	};

	var instance = new imap(account);

	instance.Backup(function () {res.send('Backup done! or not!');});
});


app.get('/create', function (req, res) {
	res.render('google-gmail-create');
});


module.exports = {
	application: app
};