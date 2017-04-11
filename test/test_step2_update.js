var app = require('../index')

var npm_packages = ["moment", "underscore"]

var javascript_code = "" +
  " exports.handler = function(event, context) { " +
  "   console.log('value1 =', event.key1); " +
  "   console.log('value2 =', event.key2); " +
  "   console.log('value3 =', event.key3); " +
  "   context.succeed(event.key1); " +
  " }; ";
var function_name = "mytest";
app.update(npm_packages, javascript_code, function_name);