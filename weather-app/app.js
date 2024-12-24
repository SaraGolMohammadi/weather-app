const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "360cadcd19a26b350d91ceca804c5901";
const Days = [
  "sunday, 1sep",
  "monday , 2sep",
  "tuesday, 3sep",
  "wednesday,4sep",
  "thursday ,5sep",
  "friday,6sep",
  "saturday,7sep",
];

const searchInput = document.querySelector(".input-search");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const clockElement = document.getElementById("clock");
const forecastContainer = document.getElementById("forecast");
const hourlyforecast = document.getElementById("hourlyforecast");
const toggleSwitch = document.getElementById("dark-mode-toggle");

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
const getForcastWeatherByName = async (city) => {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const gethourlyforecastWeatherByName = async (city) => {
  const url = `${BASE_URL}/forecast?q=${city}&units=metric&cnt=8&appid=${API_KEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

toggleSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

const renderCurrentweather = (data) => {
  const iconMap = {
    'clouds': "./img/02d.png",
    'rain': "./img/04d.png",
    'clear': "./img/01d.png", 
    'thunderstorm': "./img/11d.png",
    'snow':  "./img/13d.png"
  };
  const iconPath = iconMap[data.weather[0].main.toLowerCase()];
  console.log(data);
  const weatherJSx = `

  <div id="main">
   <div id="main-div">
   <p>${Math.round(data.main.temp)} °C</P>
   <span>${data.weather[0].main}</span> 
 
     <div id="sun">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" class="cursor-hover"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18H2M6.31412 12.3141L4.8999 10.8999M17.6858 12.3141L19.1 10.8999M22 18H20M7 18C7 15.2386 9.23858 13 12 13C14.7614 13 17 15.2386 17 18M22 22H2M16 6L12 2M12 2L8 6M12 2V9" stroke="#ededed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        <p>Sunrise: <span>${new Date(
          data.sys.sunrise * 1000
        ).toLocaleTimeString()}</span></p>
         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-hover" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18H2M6.31412 12.3141L4.8999 10.8999M17.6858 12.3141L19.1 10.8999M22 18H20M7 18C7 15.2386 9.23858 13 12 13C14.7614 13 17 15.2386 17 18M22 22H2M16 5L12 9M12 9L8 5M12 9V2" stroke="#ebebeb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-hover"></path> </g></svg>
        <p>Sunset: <span>${new Date(
          data.sys.sunset * 1000
        ).toLocaleTimeString()}</span></p>
      </div>
  </div> 

   <div>
        <img id="main-img" alt="weathericon" src="${iconPath}"/>
      </div>
      
  <div id="info">
   <div>
   <img src="./img/gauge-pressure-svgrepo-com.png" alt="">
    <p>pressure:<span>${data.main.pressure}</span></p>
  </div>

  <div>
   <img src="./img/wind-svgrepo-com.png" alt="">
  <p>WindSpeed:<span>${data.wind.speed}</span></p>
  </div>


  <div>
  <img src="./img/humidity-svgrepo-com.png" alt="">
   <p>Humidity:<span>${data.main.humidity}</span></p>
  </div>

  <div>
<img src="./img/sun-cloudy-svgrepo-com.png" alt="">
<p>Cloudiness:<span>${data.clouds.all} %</span></p>

 </div>
 

  </div>
 
  `;
  updateClock(data);
  weatherContainer.innerHTML = weatherJSx;
};

const getWeekDay = (data) => {
  return Days[new Date(data * 1000).getDay()];
};
const renderForecastWeather = (data) => {
  const iconMap = {
    'clouds': "./img/02d.png",
    'rain': "./img/04d.png",
    'clear': "./img/01d.png", 
    'thunderstorm': "./img/11d.png",
    'snow':  "./img/13d.png"
  };

  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));

  data.forEach((i) => {
    const iconPath = i.weather && i.weather[0] 
      ? iconMap[i.weather[0].main.toLowerCase()] 
      : './img/icons/default.png'; // مقدار پیش‌فرض در صورت عدم وجود مقدار صحیح

    const forecastJsx = ` 
      <div id="forecca">
        <div>
          <img id="main-img14" alt="weathericon" src="${iconPath}"/>
        </div>

        <p>${Math.round(i.main.humidity)} °C</p>
        <h3>${getWeekDay(i.dt)}</h3>
      </div>
    `;

    forecastContainer.innerHTML += forecastJsx;
  });
};

const renderhourlyforecast = (data) => {
  const iconMap = {
    'clouds': "./img/02d.png",
    'rain': "./img/04d.png",
    'clear': "./img/01d.png", 
    'thunderstorm': "./img/11d.png",
    'snow':  "./img/13d.png"
  };
  
  data = data.list.filter(
    (obj) =>
      obj.dt_txt.endsWith("12:00:00") ||
      obj.dt_txt.endsWith("15:00:00") ||
      obj.dt_txt.endsWith("18:00:00") ||
      obj.dt_txt.endsWith("21:00:00") ||
      obj.dt_txt.endsWith("00:00:00")
  );

  hourlyforecast.innerHTML = "";
  data.forEach((u) => {
    const windSpeed = u.wind && u.wind.speed ? u.wind.speed : "N/A"; 
    const windDirection = u.wind && u.wind.deg ? u.wind.deg : 0;
    const iconPath = u.weather && u.weather[0] && iconMap[u.weather[0].main.toLowerCase()] ? iconMap[u.weather[0].main.toLowerCase()] : './img/icons/default.png'; // Default icon path
    const time = u.dt_txt.split(" ")[1].slice(0, 5);

    const hourlyforecastJsx = `
      <div id="for">
        <div id="forecast1">
          <h3>${time}</h3>
          <img id="main-img1" alt="weathericon" src="${iconPath}"/>

          <p>${Math.round(u.main.humidity)} °C</p>

          <img id="main-img12" src="./img/arrow-direction-maps-3-svgrepo-com.png" style="transform: rotate(${windDirection}deg);" alt="wind direction">
          <p>${windSpeed} km/h</p>
        </div>
      </div>
    `;
    hourlyforecast.innerHTML += hourlyforecastJsx;
  });
};


const updateClock = (data) => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const cityInfo = `${data.name}, ${data.sys.country}`;

  clockElement.innerHTML = `<div id="clock-div">
  <h1>${cityInfo}</h1>
  <p>${hours}:${minutes}</p>
  </div>`;
};

const searchHandler = async () => {
  const cityName = searchInput.value.trim();
  if (!cityName) {
    alert("Please enter city name!");
  }

  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentweather(currentData);
  const forecastData = await getForcastWeatherByName(cityName);
  renderForecastWeather(forecastData);
  const hourlyforecastData = await gethourlyforecastWeatherByName(cityName);
  renderhourlyforecast(hourlyforecastData);
};

searchButton.addEventListener("click", searchHandler);
