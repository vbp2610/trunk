var Client = require('./frontendClient.js');
var commandHandler = require('./commandHandler.js');
var options={};
options.host='localhost';
options.port='9222';
options.chooseTab=1;
var  client= new Client(options);
var command_handler = new commandHandler(client);
client.getTabs();
client.on('gettabs', gettabSuccess);
client.on("wsOpen", sendMessage);
function gettabSuccess(tabs){
	client.connectTab(0);
}
function sendMessage(){
	callbackResponseReceived = function(){
		console.log('yes we got the callback successfully');
	}
	client.on('Network.responseReceived', callbackResponseReceived);
	client.Network.commands.enable();
    client.Page.commands.enable();
    client.Page.commands.navigate({'url': 'https://github.com'});
	console.log("we are inside the send message function successfull");	
}



