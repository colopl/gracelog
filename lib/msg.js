var util = require('util');
var color = require('./color');

var showHidden = false;
var depth = 4;

module.exports.setup = function (config) {
	color.setup(config);
	if (config.showHidden) {
		showHidden = true;
	}
	if (config.depth) {
		depth = config.depth;
	}
};

module.exports.create = function (prefix, logName, levelName, args) {
	var date = new Date();
	var ymd = date.getFullYear() + '/' + pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2);
	var his = pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2) + ':' + pad(date.getMilliseconds(), 3); 
	var timestamp = ymd + ' ' + his;
	var msg = ['[' + timestamp + ']' + (prefix ? '[' + prefix + ']' : '') + '<' + levelName + '>[' + logName + ']'];
	for (var key in args) {
		msg.push(createMsg(args[key]));
	}
	return { message: color.create(levelName, msg.join(' ')), timestamp: date.getTime() };
};

function createMsg(msgItem) {
	if (typeof msgItem === 'object') {
		if (msgItem instanceof Error) {
			msgItem = msgItem.message + '\n<stack trace>\n' + msgItem.stack;
		} else {
			msgItem = '\n' + util.inspect(msgItem, { showHidden: showHidden, depth: depth });
		}
	}
	return msgItem;
}

function pad(n, digit) {
	n = n.toString();
	var len = n.length;
	if (len < digit) {
		var diff = digit - len;
		var padding = '';
		while (diff) {
			padding += '0';
			diff--;
		}
		n = padding + n;
	}
	return n;
}
