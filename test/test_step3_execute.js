var app = require('../index')

var function_name = "mytest";

var event_object = {
  key1 : "value1",
  key2 : "value2",
  key3 : "value3"
}
var event_string = JSON.stringify(event_object);
app.execute(function_name, event_string);
