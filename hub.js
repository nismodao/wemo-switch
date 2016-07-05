require('dotenv').config();
var Wemo         = require('./index');
var WemoClient   = require('./client');
var wemo         = new Wemo();
//var express      = require ( 'express' );
//var http = require('http');
//var server          = express(http);
var request      = require( 'request' );
//var bodyParser   = require ( 'body-parser');
var api          = require( './app.js' );
//app.use( bodyParser.json());
//app.use( bodyParser.urlencoded({
  //extended: true
//}));
sio = require('socket.io');

var http = require('http');

var server = http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('hello world');
    response.end();
});

server.listen(8080);

io = sio.listen(server);
// store messages
var message;
// Define a message handler
io.sockets.on('connection', function (socket) {
  socket.on('message', function (msg) {
    console.log('Received: ', msg);
    message = msg;
    wemo.load(process.env.wemo_IP, (deviceInfo) => {
      var client = wemo.client(deviceInfo);
      //console.log(deviceInfo);   
      client.on('binaryState', (value) => {
        console.log('Binary State changed to: %s', value);
      });   
      client.getBinaryState((err,data) => {
        console.log('data is', data);
        //var message = JSON.parse(body)[0];
        if (err) return console.log(err);
        console.log('messages is', message);
        if (data === '8' && message === 'turn off') {
          client.setBinaryState(0, (err, res) => {
            if (!err) console.log(res);
          });
        }
        if (data === '0' && message === 'turn on') {
          console.log('hello');
          client.setBinaryState(1, (err, res) => {
            if (!err) console.log(res);
          });
        }
      });      
    })
    // messages.push(msg);
    // socket.broadcast.emit('message', msg);
  });
  // send messages to new clients
  // messages.forEach(function(msg) {
  //   socket.send(msg);
  // })
}); 


// request.get('http://fuf.me:8080/api/v1/wemo', function (err, res, body) {
  
// });

// app.listen(8070);
