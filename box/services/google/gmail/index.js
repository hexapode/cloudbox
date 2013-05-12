
var _express = require('express');
var _imap = require('imap');
var _fs = require('fs');
var _path = require('path');
var	_imapInstance = require('./ImapInstance.js');

var app = _express.createServer();

function verifyAccount(username, password, next) {
	var account = {
		user: username,
		password: password,
		host: 'imap.gmail.com',
		port: 993,
		secure: true
	};
	var imap = new _imap(account);

	imap.connect(function (error) {
		if (error) {
			return next(error);
		}
		imap.logout(function () {});
		return next();
	});
}


function getAccountSettingsPath (username) {
	var accounts_path = app.set('google gmail data path');
	var account_path = accounts_path+'/'+username;
	return account_path+'/settings.json';
}

function getAccountPath (username) {
	var accounts_path = app.set('google gmail data path');
	return accounts_path+'/'+username;
}

function createAccountSettings (settings, next) {
	var settings_path = getAccountSettingsPath(settings.username);

	_fs.mkdir(_path.dirname(settings_path), function (error) {
		if (error) { return next(error); }

		_fs.writeFile(settings_path, JSON.stringify(settings), 'utf8', function (error) {
			if (error) { return next(error); }

			return next();
		});
	});
}

function getAccountSettings (username, next) {
	var settings_path = getAccountSettingsPath(username);

	_fs.readFile(settings_path, 'utf8', function (error, data) {
		if (error) { return next(error); }
		return next(null, JSON.parse(data));
	});
}

function getAccounts () {
	var accounts_path = app.set('google gmail data path');

	return _fs.readdirSync(accounts_path);
}

app.get('/', function (req, res) {
	res.send('google/gmail root');
});


app.get('/account/:username/backup', function (req, res, next) {
	getAccountSettings(req.params.username, function (error, settings) {
		if (error) { return next(error); }
		var account = {
			user: settings.username,
			password: settings.password,
			host: 'imap.gmail.com',
			port: 993,
			secure: true
		};

		var instance = new _imapInstance(account);

		instance.Backup(getAccountPath(settings.username), function () {res.send('Backup done! or not!');});
	});
});


app.get('/create', function (req, res) {
	res.render('google-gmail-create', {
		accounts: getAccounts()
	});
});


app.post('/create', _express.bodyParser(), function (req, res, next) {
	if (!(req.hasOwnProperty('body') && req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password'))) {
		return next('Invalid parameters.');
	}

	var settings = {
		username: req.body.username,
		password: req.body.password
	};

	verifyAccount(req.body.username, req.body.password, function (error) {
		if (error) {
			res.render('google-gmail-create', {
				accounts: getAccounts(),
				errors: [
					'Username or/and Password invalid.'
				]
			});
			return;
		}

		createAccountSettings(settings, function(error) {
			if (error) {
				res.render('google-gmail-create', {
					accounts: getAccounts(),
					errors: [
						'Impossible de creer le compte.'
					]
				});
				return;
			}

			res.redirect('/create');

			return;
		});
	});
});

app.post('/verify', _express.bodyParser(), function (req, res, next) {
	if (!(req.hasOwnProperty('body') && req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password'))) {
		return next('Invalid parameters.');
	}

	verifyAccount(req.body.username, req.body.password, function(error) {
		res.send(JSON.stringify({ success: !error }));
	});

});

module.exports = {
	application: app
};