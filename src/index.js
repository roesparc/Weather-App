import "./style.css";

function getLocationData(location) {
  return new Promise((resolve, reject) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=64376a19b2c057c2cb433188bcfe9a0a`,
      { mode: "cors" }
    )
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

async function getWeatherData() {
  const locationData = await getLocationData("london");

  const { lat } = locationData[0];
  const { lon } = locationData[0];

  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=64376a19b2c057c2cb433188bcfe9a0a`,
    { mode: "cors" }
  );
  const weatherData = await weatherResponse.json();

  return weatherData;
}
