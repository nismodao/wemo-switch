var AWS          = require('aws-sdk');
AWS.config.credentials =
    new AWS.SharedIniFileCredentials({ profile: 'newreactions' });
AWS.config.update({region: 'us-east-1'});
var Consumer     = require('sqs-consumer');
var messageSend = [];
var app = Consumer.create({
  queueUrl: process.env.queue_URL,
  handleMessage: function (message, done) {
    if (!!message.Body) messageSend.push(message.Body);
    //console.log(messageSend);
      done();
  },
  sqs: new AWS.SQS()
  });
app.on('error', (err) => {
  console.log('err from app.js is', err.message);
});
app.start();

module.exports.fetch = app;