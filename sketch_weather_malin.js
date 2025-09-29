let currentWeatherData;
let aiForecast = [];
let currentWeatherInputData = [];
let elementWeahterTable;
let elementBackWeatherTable;

function weatherPreload() {
  // coordinates muelheim 50.98608, 7.013688
  currentWeatherData = loadJSON("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation,cloud_cover&timezone=Europe%2FBerlin&forecast_days=3");
}

function weatherSetup() {
  prepCurrentInputData();
  runNetwork();

  let currentTime = Number(currentWeatherData.current.time.split('T')[1].split(':')[0]);

  elementWeahterTable = document.getElementById('weather_table');
  elementBackWeatherTable = document.getElementById('weather_table_back');
  
  let weatherTable = elementWeahterTable.children;
  let weatherTableBack = elementBackWeatherTable.children;

  let timeElements = weatherTable.item(0).children;  
  let timeElementsBack = weatherTableBack.item(0).children;  

  let temperatureElements = weatherTable.item(1).children;
  let temperatureElementsBack = weatherTableBack.item(1).children;

  let cloudElements = weatherTable.item(3).children;
  let cloudElementsBack = weatherTableBack.item(3).children;

  let precipitationElements = weatherTable.item(5).children;
  let precipitationElementsBack = weatherTableBack.item(5).children;

  for (let i = 0; i < 5; i++) {
    if (i > 0) {
      timeElements.item(i).innerHTML = (currentTime + i * 3) % 24 + ':00';
      timeElementsBack.item(i).innerHTML = (currentTime + i * 3) % 24 + ':00';

      temperatureElements.item(i).innerHTML = round(aiForecast[(i - 1) * 3] * 100 - 50) + '°C';
      temperatureElementsBack.item(i).innerHTML = round(currentWeatherData.hourly.temperature_2m[currentTime + i * 3]) + '°C';

      cloudElements.item(i).innerHTML = round(aiForecast[(i - 1) * 3 + 2] * 100) + '%';
      cloudElementsBack.item(i).innerHTML = currentWeatherData.hourly.cloud_cover[currentTime + i * 3] + '%';

      precipitationElements.item(i).innerHTML = round(aiForecast[(i - 1) * 3 + 1] * 1000) + 'mm';
      precipitationElementsBack.item(i).innerHTML = round(currentWeatherData.hourly.precipitation[currentTime + i * 3]) + 'mm';
    }
    else {
      temperatureElements.item(i).innerHTML = round(currentWeatherData.current.temperature_2m) + '°C';
      temperatureElementsBack.item(i).innerHTML = round(currentWeatherData.current.temperature_2m) + '°C';

      cloudElements.item(i).innerHTML = currentWeatherData.current.cloud_cover + '%';
      cloudElementsBack.item(i).innerHTML = currentWeatherData.current.cloud_cover + '%';

      precipitationElements.item(i).innerHTML = round(currentWeatherData.current.precipitation) + 'mm';
      precipitationElementsBack.item(i).innerHTML = round(currentWeatherData.current.precipitation) + 'mm';
    }
  }
}

const animationStart = 100;
const animationLength = 80;
let animationVar = 0;
const animationStep = (Math.PI * 0.5) / animationLength;

function weatherDraw() {
  
  if (frameCount == animationStart)
    flipWeatherBox();
}

function flipWeatherBox() {
  let flipFac = animationVar * 0.00125;
  flipFac -= floor(flipFac);
  flipFac = smoothStep(flipFac);
  flipFac *= 360;

  elementWeahterTable.style.transform = "rotateY(" + (flipFac) + "deg)";
  elementBackWeatherTable.style.transform = "rotateY(" + (flipFac + 180) + "deg)";

  if (flipFac > 90 && flipFac < 360 - 90) {
    elementBackWeatherTable.style.display = "block";
    elementWeahterTable.style.display = "none";
  } else {
    elementBackWeatherTable.style.display = "none";
    elementWeahterTable.style.display = "block";
  }

  animationVar++;
  setTimeout(flipWeatherBox, 1000 / 60);
}

function smoothStep(x) {
  return -24 * x**5 + 60 * x**4 -50 * x**3 + 15 * x**2;
}
