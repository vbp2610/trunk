chrome-remote-interface
=======================

[Remote Debugging Protocol][1] interface that helps to instrument Chrome by
providing a simple abstraction of the two main objects exposed by the protocol
in a Node.js fashion: commands and notifications.

Installation
------------

    npm install webkit-remote-debug-client

Chrome setup
------------

Chrome needs to be started with the `--remote-debugging-port=<port>` option to
enable the [Remote Debugging Protocol][1], for example:In Mac OSX run command

    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=remote-profile
    
Sample API usage
----------------

The following snippet loads `http://vbp2610.github.io/` and dumps every request made.

```javascript
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
    client.Page.commands.navigate({'url': 'http://vbp2610.github.io/'});
        
}

```


API
---

### Client([options])

Create a frontEnd client to connect with remote chrome instance under [Remote Debugging
Protocol][1].

`options` is an object with the following optional properties:

- `host`: [Remote Debugging Protocol][1] host. Defaults to `localhost`;
- `port`: [Remote Debugging Protocol][1] port. Defaults to `9222`;


Returns an `FrontEndClient` instace:

#### Event: 'gettabs'

    Emitted when client get tabs object of the chrome.



#### Event: 'wsOpen'

    
Emitted as the webSocket open with chrome to pass the message under [Remote Debugging
Protocol][1].



#### How to subscribe for Event emit by chrome

client.on('domain.event', callback);

for Example :client.on('Network.responseReceived', callbackResponseReceived);

### How to send command to chrome
client.domain.commands.commandName();

for example: client.Page.commands.enable();
Resources
---------

- [Chrome Developer Tools: Remote Debugging Protocol v1.1][1]

[1]: https://developer.chrome.com/devtools/docs/protocol/1.1/index
