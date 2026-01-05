let currentWeatherData;
let aiForecast = [];
let currentWeatherInputData = [];
let elementAIWeatherTable;
let elementWeatherTable;

function weatherPreload() {
  // coordinates muelheim 50.98608, 7.013688
  currentWeatherData = loadJSON("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation,cloud_cover&timezone=Europe%2FBerlin&forecast_days=3");
}

function weatherSetup() {
  prepCurrentInputData();
  runNetwork();

  let currentTime = Number(currentWeatherData.current.time.split('T')[1].split(':')[0]);

  elementAIWeatherTable = document.getElementById('ai_weather_table');
  elementWeatherTable = document.getElementById('weather_table');
  
  let aiWeatherTable = elementAIWeatherTable.children;
  let weatherTable = elementWeatherTable.children;

  let aiTimeElements = aiWeatherTable.item(0).children;  
  let timeElements = weatherTable.item(0).children;  

  let aiTemperatureElements = aiWeatherTable.item(1).children;
  let temperatureElements = weatherTable.item(1).children;

  let aiCloudElements = aiWeatherTable.item(3).children;
  let cloudElements = weatherTable.item(3).children;

  let aiPrecipitationElements = aiWeatherTable.item(5).children;
  let precipitationElements = weatherTable.item(5).children;

  for (let i = 0; i < 5; i++) {
    if (i > 0) {
      aiTimeElements.item(i).innerHTML = (currentTime + i * 3) % 24 + ':00';
      timeElements.item(i).innerHTML = (currentTime + i * 3) % 24 + ':00';

      aiTemperatureElements.item(i).innerHTML = round(aiForecast[(i - 1) * 3] * 100 - 50) + '°C';
      temperatureElements.item(i).innerHTML = round(currentWeatherData.hourly.temperature_2m[currentTime + i * 3]) + '°C';

      aiCloudElements.item(i).innerHTML = round(aiForecast[(i - 1) * 3 + 2] * 100) + '%';
      cloudElements.item(i).innerHTML = currentWeatherData.hourly.cloud_cover[currentTime + i * 3] + '%';

      aiPrecipitationElements.item(i).innerHTML = round(aiForecast[(i - 1) * 3 + 1] * 1000) + 'mm';
      precipitationElements.item(i).innerHTML = round(currentWeatherData.hourly.precipitation[currentTime + i * 3]) + 'mm';
    }
    else {
      aiTemperatureElements.item(i).innerHTML = round(currentWeatherData.current.temperature_2m) + '°C';
      temperatureElements.item(i).innerHTML = round(currentWeatherData.current.temperature_2m) + '°C';

      aiCloudElements.item(i).innerHTML = currentWeatherData.current.cloud_cover + '%';
      cloudElements.item(i).innerHTML = currentWeatherData.current.cloud_cover + '%';

      aiPrecipitationElements.item(i).innerHTML = round(currentWeatherData.current.precipitation) + 'mm';
      precipitationElements.item(i).innerHTML = round(currentWeatherData.current.precipitation) + 'mm';
    }
  }
}
