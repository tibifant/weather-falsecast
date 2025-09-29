//let trainingDataSet = [];

//const weatherData = [data_cologne, data_northWest, data_north, data_northEast, data_west, data_east, data_southWest, data_south, data_southEast];
//const weatherDataCologne = data_cologne;

function dataPrep() {
  //trainingDataSet = loadJSON('assets/training_dataset.json');
  //return;

  // did i forget any data point?
  console.assert(weatherData.length == 9);

  // check if the weather data all have the same length
  for (let i = 0; i < weatherData.length; i++) {
    console.assert(weatherData[0].hourly.time.length == weatherData[i].hourly.time.length)
  }
  
  //writeInputDataToFile();
  //writeOutputDataToFile();

  //writeFewInputDataToFile();
  //writeFewOutputDataToFile();
}

let outputData = [];
function writeOutputDataToFile() {

  console.log("staring to iterate output data");

  let start = weatherDataCologne.hourly.time.length / 2;
  //0;
  let end = weatherDataCologne.hourly.time.length - 48 - 1; 
  //weatherDataCologne.hourly.time.length / 2;

  // write output data in csv formatting
  for (let i = start; i < end; i++) {
    let oneLineOfOutputData = "";

    // data for every hour of the next 48 hours
    for (let j = 1; j <= 48; j++) {
      if (j > 1)
        oneLineOfOutputData = oneLineOfOutputData.concat(",");

      // get the relevant data points for one timestamp
      // all values betwenn 0 and 1
      // check for `null` as javascript thinks this is correct: `null * 0.01 = 0`
      let temperature_2m = weatherDataCologne.hourly.temperature_2m[i + j];
      temperature_2m = temperature_2m == null ? null : (temperature_2m + 50) * 0.01; // value between 0 and (less than) 1, shift negative values +50, divide by max temp of 50
      let precipitation = weatherDataCologne.hourly.precipitation[i + j];
      precipitation = precipitation == null ? null : precipitation * 0.001; // mm to cm
      let cloud_cover = weatherDataCologne.hourly.cloud_cover[i + j];
      cloud_cover = cloud_cover == null ? null : cloud_cover * 0.01; // percent to value between 0 and 1
      
      // append string with the datapoints seperated by ','
      oneLineOfOutputData = oneLineOfOutputData.concat(temperature_2m, ",", precipitation, ",", cloud_cover);
    }

    // add the string to the outputData array with the data from one timestamp being one entry in the array 
    outputData[i - start] = oneLineOfOutputData;

    if (i % 1000 == 0)
      console.log(i);
  }

  console.log("attempting to write to file");
  // saveStrings() adds a linebreak after every entry from the array
  saveStrings(outputData, 'outputData.txt');
}

// version with lesser outputs
function writeFewOutputDataToFile() {

  console.log("staring to iterate output data");

  let start = //weatherDataCologne.hourly.time.length / 2;
  0;
  let end = weatherDataCologne.hourly.time.length - 12 - 1; 
  //weatherDataCologne.hourly.time.length / 2;

  // write output data in csv formatting
  for (let i = start; i < end; i++) {
    let oneLineOfOutputData = "";

    // data for every hour of the next 48 hours
    for (let j = 3; j <= 12; j += 3) {
      if (j > 3)
        oneLineOfOutputData = oneLineOfOutputData.concat(",");

      // get the relevant data points for one timestamp
      // all values betwenn 0 and 1
      // check for `null` as javascript thinks this is correct: `null * 0.01 = 0`
      let temperature_2m = weatherDataCologne.hourly.temperature_2m[i + j];
      temperature_2m = temperature_2m == null ? null : (temperature_2m + 50) * 0.01; // value between 0 and (less than) 1, shift negative values +50, divide by max temp of 50
      let precipitation = weatherDataCologne.hourly.precipitation[i + j];
      precipitation = precipitation == null ? null : precipitation * 0.001; // mm to cm
      let cloud_cover = weatherDataCologne.hourly.cloud_cover[i + j];
      cloud_cover = cloud_cover == null ? null : cloud_cover * 0.01; // percentage to value between 0 and 1
      
      // append string with the datapoints seperated by ','
      oneLineOfOutputData = oneLineOfOutputData.concat(temperature_2m, ",", precipitation, ",", cloud_cover);
    }

    // add the string to the outputData array with the data from one timestamp being one entry in the array 
    outputData[i - start] = oneLineOfOutputData;

    if (i % 1000 == 0)
      console.log(i);
  }

  console.log("attempting to write to file");
  // saveStrings() adds a linebreak after every entry from the array
  saveStrings(outputData, 'outputData.txt');
}

function writeInputDataToFile() {  
  const halfDataLength = weatherData[0].hourly.time.length / 2;
  // accumulate the days that already past in a year for every month
  const daysAkkumulative = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  // input data
  let inputData = [];
  
  console.log("staring to iterate input data");

  let start = //0;
  halfDataLength;
  let end = //halfDataLength;
  weatherData[0].hourly.time.length - 48;

  // write half of the input data in csv formatting (as writing everything at the same time didn't go well)
  for (let i = start; i < end; i++) {
    // one line of input data reffering to all data points from one timestamp
    let oneLineOfInputData = "";

    // iterate the different locations
    for (let j = 0; j < weatherData.length; j++) {
      // all values betwenn 0 and 1
      // check for `null` as javascript thinks this is correct: `null * 0.01 = 0`
      let temperature_2m = weatherData[j].hourly.temperature_2m[i]; 
      temperature_2m = temperature_2m == null ? null : (temperature_2m + 50) * 0.01; // °C value between 0 and (less than) 1, shift negative values +50, divide by max temp of 50

      let relative_humidity_2m = weatherData[j].hourly.relative_humidity_2m[i];
      relative_humidity_2m = relative_humidity_2m == null ? null : relative_humidity_2m * 0.01; // % percent to value between 0 and 1

      let apparent_temperature = weatherData[j].hourly.apparent_temperature[i];
      apparent_temperature = apparent_temperature == null ? null : (apparent_temperature + 50) * 0.01; // °C 

      let precipitation = weatherData[j].hourly.precipitation[i];
      precipitation = precipitation == null ? null : precipitation * 0.001; // mm to m

      let rain = weatherData[j].hourly.rain[i];
      rain = rain == null ? null : rain * 0.001; // mm to m

      let snowfall = weatherData[j].hourly.snowfall[i];
      snowfall = snowfall == null ? null : snowfall * 0.001; // cm / 1000 

      let pressure_msl = weatherData[j].hourly.pressure_msl[i];
      pressure_msl = pressure_msl == null ? null : pressure_msl / 1100; // hPa (maximum measurment 1060) 

      let surface_pressure = weatherData[j].hourly.surface_pressure[i];
      surface_pressure = surface_pressure == null ? null : surface_pressure / 1100; // hPa 

      let cloud_cover = weatherData[j].hourly.cloud_cover[i];
      cloud_cover = cloud_cover == null ? null : cloud_cover * 0.01; // % 

      let wind_speed_10m = weatherData[j].hourly.wind_speed_10m[i];
      wind_speed_10m = wind_speed_10m == null ? null : wind_speed_10m * 0.001; // km/h / 1000

      let wind_direction_10m = weatherData[j].hourly.wind_direction_10m[i];
      wind_direction_10m = wind_direction_10m == null ? null : wind_direction_10m / 360; // degree / 360

      let wind_gusts_10m = weatherData[j].hourly.wind_gusts_10m[i];
      wind_gusts_10m = wind_gusts_10m == null ? null : wind_gusts_10m * 0.001; // km/h

      // add all data points from one location to the single line
      oneLineOfInputData = oneLineOfInputData.concat(temperature_2m, ",", relative_humidity_2m, ",", apparent_temperature, ",", precipitation, ",", rain, ",", snowfall, ",", pressure_msl, ",", surface_pressure, ",", cloud_cover, ",", wind_speed_10m, ",", wind_direction_10m, ",", wind_gusts_10m, ",");
    }
    
    // calculate date and time as percentages
    let dateAndTime = weatherData[0].hourly.time[i].split('T');

    let date = dateAndTime[0].split('-');
    let yearPercentage = (daysAkkumulative[Number(date[1]) - 1] + Number(date[2])) / 365;

    let time = dateAndTime[1].split(':');
    let dayPercentage = time[0] / 24;

    let year = (date[0] - 1900) / 200;

    // add date and time as end of a line
    oneLineOfInputData = oneLineOfInputData.concat(yearPercentage, ",", dayPercentage, ",", year);

    if (oneLineOfInputData.includes("NaN")) {
      console.log("NAN!!");
      debugger;
    }

    // add single line to array with all input data
    inputData[i - start] = oneLineOfInputData;

    if (i % 1000 == 0)
      console.log(i);
  }

  console.log("attempting to save file");
  // saveStrings() adds a linebreak after every entry from the array
  saveStrings(inputData, 'inputData.txt');
}

// version with only cologne's data as input
function writeFewInputDataToFile() {  
  //const halfDataLength = weatherData[0].hourly.time.length / 2;
  // accumulate the days that already past in a year for every month
  const daysAkkumulative = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  // input data
  let inputData = [];
  
  console.log("staring to iterate input data");

  let start = 0;
  let end = data_cologne.hourly.time.length - 12;

  // write half of the input data in csv formatting (as writing everything at the same time didn't go well)
  for (let i = start; i < end; i++) {
    // one line of input data reffering to all data points from one timestamp
    let oneLineOfInputData = "";

      // all values betwenn 0 and 1
      // check for `null` as javascript thinks this is correct: `null * 0.01 = 0`
      let temperature_2m = data_cologne.hourly.temperature_2m[i]; 
      temperature_2m = temperature_2m == null ? null : (temperature_2m + 50) * 0.01; // °C value between 0 and (less than) 1, shift negative values +50, divide by max temp of 50

      let relative_humidity_2m = data_cologne.hourly.relative_humidity_2m[i];
      relative_humidity_2m = relative_humidity_2m == null ? null : relative_humidity_2m * 0.01; // % percent to value between 0 and 1

      let apparent_temperature = data_cologne.hourly.apparent_temperature[i];
      apparent_temperature = apparent_temperature == null ? null : (apparent_temperature + 50) * 0.01; // °C 

      let precipitation = data_cologne.hourly.precipitation[i];
      precipitation = precipitation == null ? null : precipitation * 0.001; // mm to m

      let rain = data_cologne.hourly.rain[i];
      rain = rain == null ? null : rain * 0.001; // mm to m

      let snowfall = data_cologne.hourly.snowfall[i];
      snowfall = snowfall == null ? null : snowfall * 0.001; // cm / 1000 

      let pressure_msl = data_cologne.hourly.pressure_msl[i];
      pressure_msl = pressure_msl == null ? null : pressure_msl / 1100; // hPa (maximum measurment 1060) 

      let surface_pressure = data_cologne.hourly.surface_pressure[i];
      surface_pressure = surface_pressure == null ? null : surface_pressure / 1100; // hPa 

      let cloud_cover = data_cologne.hourly.cloud_cover[i];
      cloud_cover = cloud_cover == null ? null : cloud_cover * 0.01; // % 

      let wind_speed_10m = data_cologne.hourly.wind_speed_10m[i];
      wind_speed_10m = wind_speed_10m == null ? null : wind_speed_10m * 0.001; // km/h / 1000

      let wind_direction_10m = data_cologne.hourly.wind_direction_10m[i];
      wind_direction_10m = wind_direction_10m == null ? null : wind_direction_10m / 360; // degree / 360

      let wind_gusts_10m = data_cologne.hourly.wind_gusts_10m[i];
      wind_gusts_10m = wind_gusts_10m == null ? null : wind_gusts_10m * 0.001; // km/h

      // add all data points from one location to the single line
      oneLineOfInputData = oneLineOfInputData.concat(temperature_2m, ",", relative_humidity_2m, ",", apparent_temperature, ",", precipitation, ",", rain, ",", snowfall, ",", pressure_msl, ",", surface_pressure, ",", cloud_cover, ",", wind_speed_10m, ",", wind_direction_10m, ",", wind_gusts_10m, ",");
    
    // calculate date and time as percentages
    let dateAndTime = data_cologne.hourly.time[i].split('T');

    let date = dateAndTime[0].split('-');
    let yearPercentage = (daysAkkumulative[Number(date[1]) - 1] + Number(date[2])) / 365;

    let time = dateAndTime[1].split(':');
    let dayPercentage = time[0] / 24;

    let year = (date[0] - 1900) / 200;

    // add date and time as end of a line
    oneLineOfInputData = oneLineOfInputData.concat(yearPercentage, ",", dayPercentage, ",", year);

    if (oneLineOfInputData.includes("NaN")) {
      console.log("NAN!!");
      debugger;
    }

    // add single line to array with all input data
    inputData[i] = oneLineOfInputData;

    if (i % 1000 == 0)
      console.log(i);
  }

  console.log("attempting to save file");
  // saveStrings() adds a linebreak after every entry from the array
  saveStrings(inputData, 'inputData.txt');
}

function prepCurrentInputData() {
  const daysAkkumulative = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  
  let temperature_2m = currentWeatherData.current.temperature_2m; 
  temperature_2m = temperature_2m == null ? null : (temperature_2m + 50) * 0.01; // °C value between 0 and (less than) 1, shift negative values +50, divide by max temp of 50

  let relative_humidity_2m = currentWeatherData.current.relative_humidity_2m;
  relative_humidity_2m = relative_humidity_2m == null ? null : relative_humidity_2m * 0.01; // % percent to value between 0 and 1

  let apparent_temperature = currentWeatherData.current.apparent_temperature;
  apparent_temperature = apparent_temperature == null ? null : (apparent_temperature + 50) * 0.01; // °C 

  let precipitation = currentWeatherData.current.precipitation;
  precipitation = precipitation == null ? null : precipitation * 0.001; // mm to m

  let rain = currentWeatherData.current.rain;
  rain = rain == null ? null : rain * 0.001; // mm to m

  let snowfall = currentWeatherData.current.snowfall;
  snowfall = snowfall == null ? null : snowfall * 0.001; // cm / 1000 

  let pressure_msl = currentWeatherData.current.pressure_msl;
  pressure_msl = pressure_msl == null ? null : pressure_msl / 1100; // hPa (maximum measurment 1060) 

  let surface_pressure = currentWeatherData.current.surface_pressure;
  surface_pressure = surface_pressure == null ? null : surface_pressure / 1100; // hPa 

  let cloud_cover = currentWeatherData.current.cloud_cover;
  cloud_cover = cloud_cover == null ? null : cloud_cover * 0.01; // % 

  let wind_speed_10m = currentWeatherData.current.wind_speed_10m;
  wind_speed_10m = wind_speed_10m == null ? null : wind_speed_10m * 0.001; // km/h / 1000

  let wind_direction_10m = currentWeatherData.current.wind_direction_10m;
  wind_direction_10m = wind_direction_10m == null ? null : wind_direction_10m / 360; // degree / 360

  let wind_gusts_10m = currentWeatherData.current.wind_gusts_10m;
  wind_gusts_10m = wind_gusts_10m == null ? null : wind_gusts_10m * 0.001; // km/h

  
  // calculate date and time as percentages
  let dateAndTime = currentWeatherData.current.time.split('T');

  let date = dateAndTime[0].split('-');
  let yearPercentage = (daysAkkumulative[Number(date[1]) - 1] + Number(date[2])) / 365;

  let time = dateAndTime[1].split(':');
  let dayPercentage = time[0] / 24;

  let year = (date[0] - 1900) / 200;

  currentWeatherInputData = [temperature_2m, relative_humidity_2m, apparent_temperature, precipitation, rain, snowfall, pressure_msl, surface_pressure, cloud_cover, wind_speed_10m, wind_direction_10m, wind_gusts_10m, yearPercentage, dayPercentage, year];
}

function runNetwork() {
  //console.log("let's-a-go!");

  let runningNet = new brain.NeuralNetwork({
    activation: 'relu', // activation function
    hiddenLayers: [64, 64, 64, 64, 64, 64],
    inputSize: 15,
    outputSize: 12
  });
  
  let weightArray = [];
  weightArray[1] = trainedModel.linear_relu_stack_0_weight;
  weightArray[2] = trainedModel.linear_relu_stack_2_weight;
  weightArray[3] = trainedModel.linear_relu_stack_4_weight;
  weightArray[4] = trainedModel.linear_relu_stack_6_weight;
  weightArray[5] = trainedModel.linear_relu_stack_8_weight;
  weightArray[6] = trainedModel.linear_relu_stack_10_weight;
  weightArray[7] = trainedModel.linear_relu_stack_12_weight;

  runningNet.weights = weightArray;
  
  let biasesArray = [];
  biasesArray[1] = trainedModel.linear_relu_stack_0_bias;
  biasesArray[2] = trainedModel.linear_relu_stack_2_bias;
  biasesArray[3] = trainedModel.linear_relu_stack_4_bias;
  biasesArray[4] = trainedModel.linear_relu_stack_6_bias;
  biasesArray[5] = trainedModel.linear_relu_stack_8_bias;
  biasesArray[6] = trainedModel.linear_relu_stack_10_bias;
  biasesArray[7] = trainedModel.linear_relu_stack_12_bias;

  runningNet.biases = biasesArray;

  let sizesArray = [15, 64, 64, 64, 64, 64, 64, 12];

  runningNet.sizes = sizesArray;
  let outputArray = [];
  for (let i = 0; i < 8; i++)
    outputArray[i] = [];

  runningNet.outputs = outputArray;
  runningNet.outputLayer = 7;

  aiForecast = runningNet.run(currentWeatherInputData);
}
