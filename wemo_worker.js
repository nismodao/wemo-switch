var AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-1'
});
var Consumer = require('sqs-consumer');
var Wemo = require('./index');
var WemoClient = require('./client');
require('dotenv').config();
var wemo = new Wemo();


wemo.load(process.env.wemo_IP, function(deviceInfo) {
  var client = wemo.client(deviceInfo);
  console.log(deviceInfo);   
  client.on('binaryState', function(value) {
    console.log('Binary State changed to: %s', value);
  });   
  var app = Consumer.create({
    queueUrl: 'https://sqs.us-west-1.amazonaws.com/996941631084/Wemo',
    handleMessage: function (message, done) {
      if (message) {
        console.log('message is', message.Body);
        client.getBinaryState( (err,data) => {
          if (err) return console.log(err);
          if (data === '8' && message.Body === 'turn off') {
            client.setBinaryState(0, (err, res) => {
              if (!err) console.log(res);
            });
          }
          if (data === '0' && message.Body === 'turn on') {
            client.setBinaryState(1, (err, res) => {
              if (!err) console.log(res);
            });
          }
        });      
      }
  done();
  },
  sqs: new AWS.SQS()
  });
  app.on('error', function (err) {
    console.log(err.message);
  });
  app.start();
});





