var	app = require('express').createServer();
var	imap = require('imap');
var fs = require('fs')


var BackupProgress = new Array();

function PrintError(err)
{
	if (err)
	{
		console.log(err);
		return true;
	}
	return false;
}

function BuildPathArray(boxes, path, pathArray)
{
	Object.keys(boxes).forEach(function(key) {
		var boxPath = path + key;
		if (boxes[key].attribs.indexOf('NOSELECT') == -1 && boxes[key].attribs.indexOf('INBOX') == -1)
			pathArray.push(boxPath);
		if (boxes[key].children)
			BuildPathArray(boxes[key].children, boxPath + boxes[key].delimiter, pathArray);
	});
}

function SaveBox(self, path, box, next)
{
	self.imapInstance.search([ 'ALL' ], function(err, results) {
		if (PrintError(err)) return next();
		if (results.length == 0) return next();
		self.imapInstance.fetch(results,
	      	{	headers: { parse: false },
	        	body: true,
	        	cb: function(fetch) {
	          		fetch.on('message', function(msg) {
	            		fileStream = fs.createWriteStream(__dirname + '/' + self.account.user + '/msg-' + msg.seqno + '-body.txt');
	            		msg.on('data', function(chunk) {
	              			fileStream.write(chunk);
	            		});
	            		msg.on('end', function() {
	              			fileStream.end();
	              			BackupProgress[BackupProgress.length - 1].nbMailSaved += 1;
	            		});
	          		});
	          	}
      		}, function(err) {
      			next();
      	});
		
	});
	
}

function SaveAllBoxes(self, pathArray, next)
{
	if (pathArray.length == 0)
		return next();
	var pathBox = pathArray.shift();
	self.imapInstance.openBox(pathBox, function(err, box) {
		if (!PrintError(err))
		{
			BackupProgress.push({path:pathBox, nbMailTotal: box.messages.total, nbMailSaved: 0});
			SaveBox(self, pathBox, box, function (){
				self.imapInstance.closeBox(function () {
					SaveAllBoxes(self, pathArray, next);
				});
			});
		}
		else
		{
			SaveAllBoxes(self, pathArray, next);
		}

	});
}






function ImapInstance(account)
{
	this.account = account;
 	this.imapInstance = new imap(account);

	this.Backup = function (next)
	{
		var self = this;

		BackupProgress = new Array();
		this.imapInstance.connect(function(err) {
			if (PrintError(err)) return next(); 

			self.imapInstance.getBoxes(function(err, boxes){
				if (PrintError(err))
				{
					self.imapInstance.logout();
					return next();
				}
				
				var pathArray = new Array();
				BuildPathArray(boxes, '', pathArray);
				SaveAllBoxes(self, pathArray, function() {
					self.imapInstance.logout();
					console.log(BackupProgress);
					next();
				});

			});
		});

	};

	this.GetBackupProgress = function ()
	{
		return BackupProgress;
	}
}


module.exports = ImapInstance;