const apiKey = "64376a19b2c057c2cb433188bcfe9a0a";

const getLocationData = (location) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`,
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

export default async function getWeatherData(location) {
  try {
    const locationData = await getLocationData(location);

    const { lat, lon } = locationData[0];

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      { mode: "cors" }
    );
    const weatherData = await weatherResponse.json();

    return weatherData;
  } catch (error) {
    return Promise.reject(error);
  }
}
