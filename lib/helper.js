var colors = require('colors');
var date = new Date();
var prefix = '[' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + '] ';

var successStream = function(message) {
	console.log(prefix + message.green);
}

var errorStream = function(message) {
	console.log(prefix + message.red);
}

var warningStream = function(message) {
	console.log(prefix + message.yellow);
}

exports.successStream = successStream;
exports.errorStream = errorStream;
exports.warningStream = warningStream;