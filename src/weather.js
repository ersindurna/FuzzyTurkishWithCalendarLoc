var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess(pos) {//request the weather here
  //construct URL
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" +
    pos.coords.latitude + "&lon=" + pos.coords.longitude +  "&lang=tr";
  
  //send request to OpenWeather
  xhrRequest(url, 'GET',
            function(responseText) {
              //response Text Contains a JSON object with weather info
              var json = JSON.parse(responseText);
              console.log(JSON.parse(responseText));//To see the JSON object
              //Temperature in Kelvin requires adjustment
              var temperature = Math.round(json.main.temp - 273.15);
              console.log("Temperatıre is " + temperature);
              //Conditions
              var conditions = json.weather[0].description;
              console.log("Conditions are " + conditions);
              var location = json.name;
              console.log("Location is " + location);
              //Assemble dictionary using our keys
              var dictionary = {
                            "KEY_TEMPERATURE": temperature,
                            "KEY_CONDITIONS": conditions,
                            "KEY_LOCATIONNAME": location
                          };
              //Send to Pebble
              Pebble.sendAppMessage(dictionary,
                      function(e) {
                        console.log("Weather info sent to Pebble Successfully!");
                      },
                      function(e) {
                        console.log("Error Sending Weather info to Pebble!");
                      }
                     );
            });
}
function locationError(err) {
  console.log("Error Requesting Location!");
}
function getWeather() {
  navigator.geolocation.getCurrentPosition(
  locationSuccess,
  locationError,
    {timeout: 15000, maximumAge: 60000}
  );
}
//Listen for when the watchface is opened
Pebble.addEventListener('ready',
                        function(e) {
                          console.log("PebbleKit JS ready!");
                          //Get initial Weather
                          getWeather();
                        });

//Listen for when AppMessage is received
Pebble.addEventListener('appmessage',
                       function(e) {
                                   console.log("AppMessage received!");
                                   getWeather();
                                   });