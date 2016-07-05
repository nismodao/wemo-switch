require('dotenv').config();
var AWS          = require('aws-sdk');
AWS.config.credentials =  new AWS.SharedIniFileCredentials({ profile: 'newreactions' });
AWS.config.update({region: 'us-east-1'});
var Consumer     = require('sqs-consumer');
var express      = require ( 'express' );
var server          = express();
var bodyParser   = require ( 'body-parser');
var AWS          = require('aws-sdk');
AWS.config.credentials =
    new AWS.SharedIniFileCredentials({ profile: 'newreactions' });
AWS.config.update({region: 'us-east-1'});
var Consumer     = require('sqs-consumer');

var client = require("socket.io-client"); 
var socket = client.connect("http://localhost:8080"); 

var messageSend = [];
var app = Consumer.create({
  queueUrl: process.env.queue_URL,
  handleMessage: function (message, done) {
    if (!!message.Body) messageSend.push(message.Body);
      socket.emit("message", message.Body);
      done();
  },
  sqs: new AWS.SQS()
  });
app.on('error', (err) => {
  console.log('err from app.js is', err.message);
});
app.start();

server.use( bodyParser.json());
server.use( bodyParser.urlencoded({
  extended: true
})); 


server.get('/api/v1/wemo', function (req, res) {
  res.json(messageSend);
  messageSend = [];
});

server.listen(8090);




