var app = require('../index')

var lambda_id = "12345"

var event_object = {
  key1 : "value1",
  key2 : "value2",
  key3 : "value3"
}

app.execute(lambda_id, event_object);
