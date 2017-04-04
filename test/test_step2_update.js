var app = require('../index')

var lambda_id = "12345"

var npm_packages = ["twitter", "aws-sdk", "underscore"]

var javascript_code = "" +
  " exports.handler = function(event, context) { " +
  "   console.log('value1 =', event.key1); " +
  "   console.log('value2 =', event.key2); " +
  "   console.log('value3 =', event.key3); " +
  "   context.succeed(event.key1); " +
  " }; ";

app.update(lambda_id, npm_packages, javascript_code);
