var lat = 0;
var lon; 
var securedApi;
var unsecuredApi;
var unsecuredApiKey = "72806926af7d99c4456ffe92f40381a1";
// http://openweathermap.org/api
var securedApiKey = "b447a45e90df14261c6527e2f4cfddef";
// https://developer.forecast.io/
var city;
var state;

var weather;
var humidity;
var pressure;
var windKph;
var windMph;
var temp;
var tempF;
var iconId;
var weatherIcon;

$(document).ready(
  getLocation()
);

function getLocation() {
  securedGetLocation()
  // unsecuredGetLocation()
};

function securedGetLocation() {
  if (navigator.geolocation) {
    
    navigator.geolocation.getCurrentPosition(function(position) {
      
      lat = position.coords.latitude;
      
      lon = position.coords.longitude;
      securedApi = 'https://api.forecast.io/forecast/' + securedApiKey + "/" + lat + ',' + lon + "?callback=?";
      securedGetWeather(securedApi);
      
    });
  } else {
    alert("Geolocation services are not supported by your browser.");
  }
}

function unsecuredGetLocation() {
  
  $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
    lat = data.lat;
    lon = data.lon;
    city = data.city;
    state = data.regionName;
    country = data.countryCode;
    
    unsecuredApi = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&APPID=" + unsecuredApiKey + "&callback=?"
    
    securedApi = "https://api.forecast.io/forecast/" + securedApiKey + "/" + lat + "," + lon 
    
    unsecuredGetWeather(unsecuredApi);
  });
};

function unsecuredGetWeather(api) {
  $.getJSON(api, function(data) {
    weather = data.weather[0].description
    weatherIcon = data.weather[0].icon
    temp = data.main.temp;
    tempF = temp * 9/5 + 32
    humidity = data.main.humidity;
    windKph = data.wind.speed;
    windMph = (windKph * 0.62).toFixed(1);
    
    unsecuredShowIcons(data);
    updateHtml()
  });
};

function securedGetWeather(securedApi) {
  $.getJSON(securedApi, function(data) {
    weather = data.currently.summary
    tempF = data.currently.temperature;
    temp = (tempF - 32) / 1.8;
    humidity = data.currently.humidity * 100;
    windMph = data.currently.windSpeed;
    windKph = (windMph * 1.61).toFixed(1);
    iconId = data.currently.icon;
    showIcons()
    updateHtml()
  });
};

function showIcons() {
  var icon = iconId;
  var skycons = new Skycons({
    "color": "black"
  });
  skycons.set("icon1", icon);
  skycons.play();
};

function unsecuredShowIcons() {
  switch (weatherIcon) {
    case "01d": 
        iconId = "clear-day";
        break;
    case "01n": 
        iconId = "clear-night";
        break;
    case "02d": 
    case "03d":
        iconId = "partly-cloudy-day";
        break;
    case "02n": 
    case "03n":
        iconId = "partly-cloudy-night";
        break;
    case "04d": 
    case "04n":
        iconId = "cloudy";
        break;
    case "10d":
    case "10n":
    case "11d":
    case "11n":
        iconId = "rain";
        break;
    case "13d":
    case "13n":
        iconId = "snow";
        break;
    case "50d":
    case "50n":
        iconId = "fog";
        break;
    default: 
        iconId = "clear-day";
        break;
  }
  
  showIcons()
}

function updateHtml() {
  if (city) {
      $("#location").html(city + ", " + state);
  }
  $("#temp").html(Math.round(temp) + "°");
  $("#tempUnits").html("C");
  $("#weather").html(weather);
  $("#humidity").html(humidity + "% humidity");
  $("#wind").html(windKph + " km/h winds");
  
  toggleUnits();
};

function toggleUnits() {
  $("#tempUnits").click(function() {
    if ($("#tempUnits").text() === "F") {
      $("#temp").html(Math.round(temp) + "°");
      $("#tempUnits").html("C");
      $("#wind").html(windKph + " km/h winds")
    } else {
      $("#temp").html(Math.round(tempF) + "°");
      $("#tempUnits").html("F");
      $("#wind").html(windMph + " m/h winds")
    }
  });
};