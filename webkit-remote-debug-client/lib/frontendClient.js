var http = require('http');
var WebSocket = require('ws');
var util = require('util');
var events = require('events');
var command_handler = require('./commandHandler');
//var commandHandler = require();
var self={};
var frontendClient = function(options){
	self = this;
    this.host = options.host || 'localhost';
    this.port = options.port || 9222;
    this.chooseTab = options.chooseTab || 0;
    this.callbacks={};
    this.nextCommandId=1;
};
util.inherits(frontendClient, events.EventEmitter);
frontendClient.prototype.getTabs = function(){
	var httpOptions = {'host': this.host,
                       'port': this.port,
                       'path': '/json'};
    var sucessCallback =   function (response) {
        var data = '';
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            
            self.tabs = JSON.parse(data);
            self.emit('gettabs', self.tabs);
        });
    };                 
    var request = http.get(httpOptions, sucessCallback);
    request.on('error', function (err) {
        console.log(err);
    });

};
frontendClient.prototype.send = function (method, params, callback) {
    var self = this;
    var id = self.nextCommandId++;
    if (typeof params === 'function') {
        callback = params;
        params = undefined;
    }
    var message = {'id': id, 'method': method, 'params': params};
    self.ws.send(JSON.stringify(message));
    // register command response callback
    if (typeof callback === 'function') {
        self.callbacks[id] = callback;
    }
};
_connectToWebSocket = function(url){
	self.ws = new WebSocket(url);
    self.ws.on('open', function () {
    	console.log("=========websocket open=======");	
        self.emit('wsOpen', self);
    });
    self.ws.on('message', function (data) {
    	console.log("======= message on==========");
        var message = JSON.parse(data);
        if (message.id) {
            var callback = self.callbacks[message.id];
            if (callback) {
                if (message.result) {
                    callback(false, message.result);
                } else if (message.error) {
                    callback(true, message.error);
                }
                delete self.callbacks[message.id];
            }
        }
        else if (message.method) {
            self.emit('event', message);
            self.emit(message.method, message.params);
        }
    });
    self.ws.on('error', function (err) {
        self.notifier.emit('error', err);
    });
};
frontendClient.prototype.connectTab = function showTab(tab_seq){
	var frontend_client = this;
	this.cmd_handler=new command_handler(frontend_client);
	tab_seq = typeof tab_seq != 'undefined' ? tab_seq : this.chooseTab;
	var tabError;
    var tab = self.tabs[tab_seq];

    if (tab) {
        var tabDebuggerUrl = tab.webSocketDebuggerUrl;
        console.log('this is the value of tabDebuggerUrl=' +tabDebuggerUrl);
        if (tabDebuggerUrl) {
            _connectToWebSocket(tabDebuggerUrl);
        } else {
           	tabError = new Error('Chosen tab does not support inspection');
            self.emit('error', tabError);
        }
    } else {
        tabError = new Error('Invalid tab index');
        self.emit('error', tabError);
    }
}

module.exports = frontendClient;