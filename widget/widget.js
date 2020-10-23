// We have to import these two libraries
//https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
//https://iot.cdnedge.bluemix.net/ind/static/js/libs/socket.io/socket.io.min.js

var socket;
var srv = "app.ubidots.com:443"  
var VAR_ID = "5f9237844763e70500e8d61b";
var TOKEN = "BBFF-Ugasz1Zb8ov9VlUTuYQMmZKoNQIdW7" 
$( document ).ready(function() {
  
function renderImage(imageBase64){
  if (!imageBase64) return;
  $('#img').attr('src', 'data:image/png;base64, ' + imageBase64);
}
  
// Function to retrieve the last value, it runs only once  
function getDataFromVariable(variable, token, callback) {
  var url = 'https://things.ubidots.com/api/v1.6/variables/' + variable + '/values';
  var headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json'
  };
  
  $.ajax({
    url: url,
    method: 'GET',
    headers: headers,
    data : {
      page_size: 1
    },
    success: function (res) {
      if (res.results.length > 0){
      	renderImage(res.results[0].context.image);
      }
      callback();
    }
  });
}

// Implements the connection to the server
socket = io.connect("https://"+ srv, {path: '/notifications'});
var subscribedVars = [];

// Function to publish the variable ID
var subscribeVariable = function (variable, callback) {
  // Publishes the variable ID that wishes to listen
  socket.emit('rt/variables/id/last_value', {
    variable: variable
  });
  // Listens for changes
  socket.on('rt/variables/' + variable + '/last_value', callback);
  subscribedVars.push(variable);
};

// Function to unsubscribed for listening
var unSubscribeVariable = function (variable) {
  socket.emit('unsub/rt/variables/id/last_value', {
    variable: variable
  });
  var pst = subscribedVars.indexOf(variable);
  if (pst !== -1){
    subscribedVars.splice(pst, 1);
  }
};

var connectSocket = function (){
  // Implements the socket connection
  socket.on('connect', function(){
    console.log('connect');
    socket.emit('authentication', {token: TOKEN});
  });
  window.addEventListener('online', function () {
    console.log('online');
    socket.emit('authentication', {token: TOKEN});
  });
  socket.on('authenticated', function () {
    console.log('authenticated');
    subscribedVars.forEach(function (variable_id) {
      socket.emit('rt/variables/id/last_value', { variable: variable_id });
    });
  });
}

/* Main Routine */
getDataFromVariable(VAR_ID, TOKEN, function(){
  connectSocket();
});
  
connectSocket();

//connectSocket();
// Subscribe Variable with your own code.
subscribeVariable(VAR_ID, function(value){
  var parsedValue = JSON.parse(value);
  console.log(parsedValue);
  //$('#img').attr('src', 'data:image/png;base64, ' + parsedValue.context.image);
  renderImage(parsedValue.context.image);
  })
});

