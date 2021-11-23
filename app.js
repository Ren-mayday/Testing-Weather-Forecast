window.onload = function () {
  document.querySelector("#current-date").innerHTML = formatDate(new Date());
};

function formatDate(date) {
  const currentDay = date.getDate();
  const weekNameDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const currentWeekNameDay = weekNameDays[date.getDay()];

  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();

  return `${currentWeekNameDay} ${currentDay}, ${currentHour}:${currentMinutes
    .toString()
    .padStart(2, "0")}`;
}

const apiKey = "38c349a49afd297ba3e65a07d11fe652";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const forecastApiURL = "https://api.openweathermap.org/data/2.5/onecall";

function getForecastData(coords) {
  axios
    .get(forecastApiURL, {
      params: { appid: apiKey, ...coords, units: "metric" },
    })
    .then((json) => json.data)
    .then((data) => {
      const dailyData = data.daily.slice(1, 6);
      dailyData.forEach((day) => {
        console.log(day);
        updateDailyForecast(day);
      });
    });
}

function searchCity(e) {
  if (e.key === "Enter") {
    const city = searchBar.value.toLowerCase();
    //if (weather[city]) {
    axios
      .get(apiUrl, { params: { appid: apiKey, q: city, units: "metric" } })
      .then((json) => json.data)
      .then((data) => {
        updateCityDisplay(city);
        let temperature = Math.round(data.main.temp);
        updateNumberTemperature(temperature);
        const {
          temp_max: max,
          temp_min: min,
          feels_like,
          humidity,
        } = data.main;
        const { speed: windSpeed } = data.wind;
        const { description: weatherDescription } = data.weather[0];
        updateMaxMin({ max, min });
        updateFeelsLike(feels_like);
        updateHumidity(humidity);
        updateWind({ windSpeed });
        updateWeatherDescription({ weatherDescription });
        getForecastData(data.coord);
      });
  }
}

const searchBar = document.getElementById("search-input"); // devuelve un elemento HTML
searchBar.addEventListener("keydown", searchCity);

function updateCityDisplay(city) {
  const displayCity = document.getElementById("city-display");
  displayCity.innerHTML = city;
}

function updateNumberTemperature(temperature) {
  const displayTemperature = document.getElementById("temperature-number");
  displayTemperature.innerHTML = temperature;
}

const degree = document.querySelector("input[name=degree]");

/*degree.addEventListener("change", function () {
  if (this.checked) {
    let temp = 17;
    let tempFahrenheit = Math.round((temp * 9) / 5 + 32);
    updateNumberTemperature(tempFahrenheit);
  } else {
    updateNumberTemperature(17);
  }
});*/

function showCurrentLocation() {
  navigator.geolocation.getCurrentPosition(success);
}

const locationBtn = document.getElementById("current-location");
locationBtn.addEventListener("click", showCurrentLocation);

function success(pos) {
  const coords = pos.coords;
  axios
    .get(apiUrl, {
      params: {
        appid: apiKey,
        lat: coords.latitude,
        lon: coords.longitude,
        units: "metric",
      },
    })
    .then((json) => json.data)
    .then((data) => {
      updateCityDisplay(data.name);
      let temperature = Math.round(data.main.temp);
      updateNumberTemperature(temperature);
      const { temp_max: max, temp_min: min, feels_like, humidity } = data.main;
      const { speed: windSpeed } = data.wind;
      const { description: weatherDescription } = data.weather[0];
      updateMaxMin({ max, min });
      updateFeelsLike(feels_like);
      updateHumidity(humidity);
      updateWind({ windSpeed });
      updateWeatherDescription({ weatherDescription });
    });
}

function updateMaxMin({ min, max }) {
  const displayMaxMin = document.getElementById("maxMin");
  displayMaxMin.innerHTML = `Maxº ${Math.round(max)} / Minº ${Math.round(min)}`;
}

function updateFeelsLike(feelsLike) {
  const displayFeelsLike = document.getElementById("feelsLike");
  displayFeelsLike.innerHTML = `Feels Like ${Math.round(feelsLike)}º`;
}

function updateHumidity(humidity) {
  const displayHumidity = document.getElementById("humidity");
  displayHumidity.innerHTML = `Humidity ${humidity}%`;
}

function updateWind({ windSpeed }) {
  const displayWind = document.getElementById("wind");
  displayWind.innerHTML = `Wind ${windSpeed}km/h`;
}

function updateWeatherDescription({ weatherDescription }) {
  const displayWeatherDescription = document.getElementById(
    "weather-description"
  );
  displayWeatherDescription.innerHTML = weatherDescription;
}

function updateDailyForecast(day) {
  const displayDailyForecast = document.getElementById("daily-forecast");

  const weatherForecastCard = `<div class="col-2">
            <div class="weather-forecast-daily">${new Date(
              day.dt * 1000
            ).toLocaleString("es-ES", { weekday: "short" })}</div>
            <p>☀</p>
              <div class="weather-forecast-temperature">
                <span class="class="weather-forecast-temperature-max">20º/</span><span class="weather-forecast-temperature-min">14º</span>
              </div>
          </div>`;
  const rowElement = document.createElement("div");
  rowElement.className = "col-2";
  rowElement.innerHTML = stringToHTML(weatherForecastCard);
  displayDailyForecast.appendChild(rowElement);
}

const stringToHTML = function (str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body.innerHTML;
};
