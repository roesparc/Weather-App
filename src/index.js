import "./style.css";

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", searchSubmit);

function searchSubmit(event) {
  event.preventDefault();
  getWeatherData()
    .then((data) => displayWeather(data))
    .catch((error) => handleErrors(error));
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
  displayTemperature(weatherData);
  displayWeatherDescription(weatherData);
  displayFeelsLike(weatherData);
  displayHumidity(weatherData);
}

function displayLocation(data) {
  const location = document.querySelector("#location");
  location.textContent = data.name;
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

function convertTemperature(data) {
  const toCelsius = Math.round(data - 273.15);
  return `${toCelsius} °C`;
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
