import getWeatherData from "../logic/weatherAPI";
import { displayWeather, toggleLoadingSpinner } from "./weatherDom";

const handleErrors = (error) => {
  if (error.message === "401" || error.message === "Location not found") {
    const searchInput = document.querySelector("#search-input");

    alert(`Location not found: ${searchInput.value}`);
  } else if (error.message === "400") {
    alert("Please enter a location");
  } else {
    alert(error);
  }

  toggleLoadingSpinner();
};

const determineLocation = (input) => {
  if (input) {
    return document.querySelector("#search-input").value;
  }

  return document.querySelector("#location").textContent;
};

const updateWeather = (input) => {
  const location = determineLocation(input);

  getWeatherData(location)
    .then((data) => displayWeather(data))
    .catch((error) => handleErrors(error));
};

const selectUnit = (target) => {
  const childElements = document.querySelectorAll(".unit-selector > div");
  childElements.forEach((child) => child.classList.remove("selected-unit"));

  target.classList.add("selected-unit");
};

const searchSubmit = (event) => {
  event.preventDefault();
  toggleLoadingSpinner(true);
  updateWeather(true);
};

const unitSelectorClick = (event) => {
  selectUnit(event.target);
  updateWeather();
};

export const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", searchSubmit);

export const unitSelector = document.querySelector(".unit-selector");
unitSelector.addEventListener("click", unitSelectorClick);

export const init = (() => {
  getWeatherData("Mexico City")
    .then((data) => displayWeather(data))
    .catch((error) => handleErrors(error));
})();
