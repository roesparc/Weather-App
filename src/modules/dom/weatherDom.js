const displayLocation = (data) => {
  const location = document.querySelector("#location");
  location.textContent = data.name;
};

const displayWeatherImage = (data) => {
  const { icon } = data.weather[0];

  const weatherImage = document.querySelector("#weather-image");
  weatherImage.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

const convertTemperature = (data) => {
  const currentUnit = document.querySelector(".selected-unit");

  if (currentUnit.textContent === "°C") {
    const toCelsius = Math.round(data - 273.15);
    return `${toCelsius} °C`;
  }

  const toFahrenheit = Math.round((data - 273.15) * (9 / 5) + 32);
  return `${toFahrenheit} °F`;
};

const displayTemperature = (data) => {
  const temperature = document.querySelector("#temperature");
  temperature.textContent = convertTemperature(data.main.temp);
};

const displayWeatherDescription = (data) => {
  const weatherDescription = document.querySelector("#weather-description");
  weatherDescription.textContent = data.weather[0].description.replace(
    /\b[a-z]/g,
    (char) => char.toUpperCase()
  );
};

const displayFeelsLike = (data) => {
  const feelsLikeTemp = document.querySelector("#feels-like");
  feelsLikeTemp.textContent = convertTemperature(data.main.feels_like);
};

const displayHumidity = (data) => {
  const humidity = document.querySelector("#humidity");
  humidity.textContent = `${data.main.humidity}%`;
};

const toggleLoadingSpinner = (activate) => {
  const loadingSpinner = document.querySelector(".fa-spinner");
  const tempInfo = document.querySelector(".temperature-info-container");

  if (activate) {
    loadingSpinner.classList.remove("no-display");
    tempInfo.classList.add("no-display");
  } else {
    loadingSpinner.classList.add("no-display");
    tempInfo.classList.remove("no-display");
  }
};

const updateBackgroundColor = (data) => {
  const tempInfo = document.querySelector(".temperature-info-container");
  tempInfo.classList.remove("no-display");

  const { icon } = data.weather[0];

  if (icon.slice(-1) === "d") {
    tempInfo.classList.remove("night");
    tempInfo.classList.add("day");
  } else {
    tempInfo.classList.add("night");
    tempInfo.classList.remove("day");
  }
};

const displayWeather = (weatherData) => {
  displayLocation(weatherData);
  displayWeatherImage(weatherData);
  displayTemperature(weatherData);
  displayWeatherDescription(weatherData);
  displayFeelsLike(weatherData);
  displayHumidity(weatherData);
  toggleLoadingSpinner();
  updateBackgroundColor(weatherData);
};

export { toggleLoadingSpinner, displayWeather };
