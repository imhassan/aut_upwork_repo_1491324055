var app = require('../index')

var npm_packages = ["twitter", "aws-sdk", "underscore"]

var javascript_code = "" +
  " exports.handler = function(event, context) { " +
  "   console.log('value1 =', event.key1); " +
  "   console.log('value2 =', event.key2); " +
  "   console.log('value3 =', event.key3); " +
  "   context.succeed(event.key1); " +
  " }; ";

app.create(npm_packages, javascript_code);
