var _http = require('http');
var _url = require('url');
var _qs = require('querystring');
var _fs = require('fs');
var _express = require('express');
var app = _express.createServer();

app.get('/', function (req, res) {
	res.send('discovery root');
});


function requestPrivateAddressDelay (delay, next) {
	requestPrivateAddress(function(error, address) {
		if (error) {
			setTimeout(function () {
				requestPrivateAddress(next);
			}, delay);
			return;
		}
		return next(null, address);
	});
}

function requestPrivateAddress (next) {
	var address = null;
	var _os = require('os');
	var ifces = _os.networkInterfaces();

	var ifce_key = app.set('discovery interface');

	if (!ifces.hasOwnProperty(ifce_key)) {
		return next('Missing interface `'+ifce_key+'`.');
	}

	ifces[ifce_key].forEach(function (ifce) {
		if ((ifce.internal === false) && (ifce.family === 'IPv4')) {
			address = ifce.address;
		}
	});

	if (!address) {
		return next('Missing `address`.');
	}

	return next(null, address);
}

function postDiscoveryMessage (message, next) {
	var url = app.set('discovery url');
	var parts = _url.parse(url);
	var rq = _http.request({
		host: parts.host,
		port: parts.port,
		path: parts.path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}, function (rs) {
		var status = rs.statusCode;
		if ((status < 200) || (status >= 400)) {
			return next('Problem with request: HTTP status `' + status + '`');
		}
		return next();
	});

	rq.on('error', function(e) {
		return next('Problem with request: `' + e.message +'`.');
	});

	rq.write(_qs.stringify(message));
	rq.end();
}

function requestDiscovery (next) {
	requestPrivateAddressDelay(30000, function (error, address) {
		if (error) { return next(error); }

		var message = {
			boxName: app.set('cloudbox name'),
			boxIp: address
		};

		postDiscoveryMessage(message, function (error) {
			if (error) { return next(error); }
			return next();
		});
	});
}

app.post('/', _express.bodyParser(), function (req, res, next) {
	if (!(req.hasOwnProperty('body') && req.body.hasOwnProperty('interface') && req.body.hasOwnProperty('status'))) {
		return next('Missing arguments. (interface or status).');
	}

	if (app.set('discovery interface') !== req.body.interface) {
		return next('`interface` must be `'+ app.set('discovery interface') +'` ('+req.body.interface+').');
	}

	if (req.body.status !== 'up') {
		return next('`status` must be `up` ('+req.body.status+').');
	}

	requestDiscovery(function (error) {
		if (error) { return next(error); }
		res.send('OK');
	});
});

module.exports = {
	application: app,
	api: {
		requestDiscovery: requestDiscovery
	}
};

