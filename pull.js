'use strict';
require('dotenv').config()
var configFile, config;
var fs = require("fs");
var besc_client = require("besc-ess-nodejs-client");
var keypair = new besc_client.keyPair(process.env.PROJECT_ID, process.env.APIKEY);
const ProjectData = besc_client.ProjectData;
const Device = besc_client.Device;
var host_client;

if(process.env.BESC_ESS_API_PATH){
    console.log("Using custom ESS API URL");
    host_client = new besc_client.Host(process.env.BESC_ESS_API_PATH);
}
else{
    console.log("Using default ESS API URL");
    host_client = besc_client.Host.createDefault();
}

//Connection String from IoT-HUB
var connectionString = process.env.CONNECTIONSTRING;

// Connects to an IoT hub's Event Hubs-compatible endpoint
// to read messages sent from a device.
var { EventHubClient, EventPosition } = require('@azure/event-hubs');

var printError = function (err) {
  console.log(err.message);
};

// - Telemetry is sent in the message body
// - The device can add arbitrary application properties to the message
var printMessage = async function (message) {

  try{
  if(!process.env.DISABLE_DATA_SEND){
    var response = await sendData(message.body.Devices);

    saveLog("\nESS API Response:");
    saveLog(response);
    }
  }catch(error){
      saveLog("Error at printmsg: " + error);
  }

};

//Sending data to MongoDB 
const sendData = async (devicesReading) => {
    try {
        configFile = fs.readFileSync("./config.json");

        config = JSON.parse(configFile);

    } catch (error) {
        console.error("Throw at config" + error);
        process.exit();

    }
    var reading = [];
    var totalEnergy = 0;

    for (var x = 0; x < devicesReading.length; x++) {

        var deviceReading = devicesReading[x];

        reading.push(new Device(deviceReading.name, deviceReading.energy));
        totalEnergy += deviceReading.energy;
    }
    

    var projectData = ProjectData.creatWithCurrentTime(
        config.ProjectName,
        reading,
        totalEnergy,
        config.AverageRT,
        config.Location
    );

    try {
        var response = await besc_client.API.sendProjectData(host_client, keypair, projectData);

        return response;
    }
    catch (apiError) {
        saveLog(`Throw at sendData: ${apiError}`);
        savelog("err");
    }
}

function saveLog(savingText){

    var datetime = new Date().toLocaleString('en-GB');

    var formatedData = jsBeautify(`${datetime}:` + savingText);

    const data = new Uint8Array(Buffer.from("\n"+formatedData));

    fs.appendFileSync('./logs.log', data);
}

// Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
// This only reads messages sent after this application started.
var ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
  console.log("Successfully created the EventHub Client from iothub connection string.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then(function (ids) {
  console.log("The partition ids are: ", ids);
  return ids.map(function (id) {
    
    return ehClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
  });
}).catch(printError);
