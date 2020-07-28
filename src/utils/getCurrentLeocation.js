const getWeather = require("./getWeather");

const getCurrentLocation = (res) => {
  navigator.geolocation.getCurrentPosition((position) => {
    getWeather(res, null, position.coords.latitude, position.coords.longitude);
  });
};

module.exports = getCurrentLocation