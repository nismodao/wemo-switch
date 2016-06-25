var AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: 'us-west-1'
});
var sqs = new AWS.SQS();

module.exports = {
  send: (req, res) => {
    var message = req.body.message.match(/turn on | turn off/);
    (!!message) ? message = message[0].trim() : message = 'not a valid input';
    var params = {
      MessageBody: message + '',
      QueueUrl: 'https://sqs.us-west-1.amazonaws.com/996941631084/Wemo',
      DelaySeconds: 0
    };
    console.log('params is', params);
    sqs.sendMessage(params, function(err, data) {
      if (err) console.log(err, err.stack); 
      else     console.log(data);        
    });
    res.end();
  }
}
