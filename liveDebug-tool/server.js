var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  if(req.param('site') === 'publisher'){
     res.sendfile('publisher.html'); 
  }else{    
    res.sendfile('developer.html');
  }
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.sockets.on("connection", function (socket) {
    var address = socket.handshake.address;
    console.log("New connection from " + address.address + ":" + address.port);
   console.log(socket.request.connection.remotePort);

//     var endpoint = socket.manager.handshaken[socket.id].address;
  //  console.log('Client connected from: ' + endpoint.address + ":" + endpoint.port);	

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
