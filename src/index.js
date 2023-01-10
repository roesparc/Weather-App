import "./style.css";

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", searchSubmit);

const unitSelector = document.querySelector(".unit-selector");
unitSelector.addEventListener("click", unitSelectorClick);

function searchSubmit(event) {
  event.preventDefault();
  getWeatherData()
    .then((data) => displayWeather(data))
    .catch((error) => handleErrors(error));
}

function unitSelectorClick(event) {
  selectUnit(event.target);
  updateUnits();
}

function selectUnit(target) {
  const childElements = document.querySelectorAll(".unit-selector > div");
  childElements.forEach((child) => child.classList.remove("selected-unit"));

  target.classList.add("selected-unit");
}

function updateUnits() {
  const temperature = document.querySelector("#temperature");

  if (temperature.textContent) {
    getWeatherData()
      .then((data) => displayWeather(data))
      .catch((error) => handleErrors(error));
  }
}

function getLocationData(location) {
  return new Promise((resolve, reject) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=64376a19b2c057c2cb433188bcfe9a0a`,
      { mode: "cors" }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }

        return response.json();
      })
      .then((data) => {
        if (!data.length) {
          throw new Error("Location not found");
        } else {
          resolve(data);
        }
      })
      .catch((error) => reject(error));
  });
}

async function getWeatherData() {
  try {
    const searchInput = document.querySelector("#search-input");

    const locationData = await getLocationData(searchInput.value);

    const { lat, lon } = locationData[0];

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=64376a19b2c057c2cb433188bcfe9a0a`,
      { mode: "cors" }
    );
    const weatherData = await weatherResponse.json();

    console.log(weatherData);
    return weatherData;
  } catch (error) {
    return Promise.reject(error);
  }
}

function displayWeather(weatherData) {
  displayLocation(weatherData);
  displayWeatherImage(weatherData);
  displayTemperature(weatherData);
  displayWeatherDescription(weatherData);
  displayFeelsLike(weatherData);
  displayHumidity(weatherData);
  updateBackgroundColor(weatherData);
}

function displayLocation(data) {
  const location = document.querySelector("#location");
  location.textContent = data.name;
}

function displayWeatherImage(data) {
  const { icon } = data.weather[0];

  const weatherImage = document.querySelector("#weather-image");
  weatherImage.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function displayTemperature(data) {
  const temperature = document.querySelector("#temperature");
  temperature.textContent = convertTemperature(data.main.temp);
}

function displayWeatherDescription(data) {
  const weatherDescription = document.querySelector("#weather-description");
  weatherDescription.textContent = data.weather[0].description.replace(
    /\b[a-z]/g,
    (char) => char.toUpperCase()
  );
}

function displayFeelsLike(data) {
  const feelsLikeTemp = document.querySelector("#feels-like");
  feelsLikeTemp.textContent = convertTemperature(data.main.feels_like);
}

function displayHumidity(data) {
  const humidity = document.querySelector("#humidity");
  humidity.textContent = `${data.main.humidity}%`;
}

function updateBackgroundColor(data) {
  const tempInfo = document.querySelector(".temperature-info-container");
  const { icon } = data.weather[0];

  if (icon.slice(-1) === "d") {
    tempInfo.classList.remove("night");
    tempInfo.classList.add("day");
  } else {
    tempInfo.classList.add("night");
    tempInfo.classList.remove("day");
  }
}

function convertTemperature(data) {
  const currentUnit = document.querySelector(".selected-unit");

  if (currentUnit.textContent === "°C") {
    const toCelsius = Math.round(data - 273.15);
    return `${toCelsius} °C`;
  }

  const toFahrenheit = Math.round((data - 273.15) * (9 / 5) + 32);
  return `${toFahrenheit} °F`;
}

function handleErrors(error) {
  if (error.message === "401" || error.message === "Location not found") {
    const searchInput = document.querySelector("#search-input");

    alert(`Location not found: ${searchInput.value}`);
  } else if (error.message === "400") {
    alert("Please enter a location");
  } else {
    alert(error);
  }
}
