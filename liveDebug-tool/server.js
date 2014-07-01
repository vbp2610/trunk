var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    console.log('this is get method port===' + req.connection.remotePort);
  if(req.param('site') === 'publisher'){
     res.sendfile('publisher.html'); 
  }else{    
    res.sendfile('developer.html');
  }
});
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      var that = io.sockets;
      var totalclient = that.sockets.length;
      console.log('total number of client connected with server=' + totalclient);
      for (var i=0; i<totalclient;i++){
        console.log('socket id='+ that.sockets[i].id);
        if(this.id == that.sockets[i].id){
            console.log("========================================================+++++++++++++++++++++++++++++++++++++++++");
        }else{
            that.connected[that.sockets[i].id].emit('chat message', msg);
        }
       console.log('why this is coming here' + that.connected[that.sockets[i].id].request.connection.remotePort);   
    }
    console.log("this is port number with whom connection has been establisher="+socket.request.connection.remotePort);
      //io.emit('chat message', msg);
      //this.emit('chat message', msg);
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
