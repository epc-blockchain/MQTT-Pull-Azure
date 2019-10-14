## BESC Azure IoT-Hub SDK Integrated System

### Configure Environment File

There is a file named ".env" in the folder, it will be setting for the application

**Sample**:

```
APIKEY=DXDSdLeJ07zEL4LML39qf9IzMVTt1Q0q
PROJECT_ID=Testing
BESC_ESS_API_PATH=
DISABLE_DATA_SEND=
CONNECTIONSTRING=HostName=MQTTBESC.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=jLT0odpOfFl2ajmdpzCX0DHsxskOY9Aae1upRwj0HaM=
```

**Explanation**:

| Key               | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| APIKEY            | A secret string provided by BESC to send the energy data to the ESS-API. |
| PROJECT_ID        | A string provided by BESC to represent the project, it must be used with the correct APIKEY. |
| BESC_ESS_API_PATH | It is the URL to the ESS-API, it will pass to the SDK. If it is empty, SDK will use default URL. |
| DISABLE_DATA_SEND | Leave it empty for the application to send data to ESS-API, if not empty, it will stop the send of data to ESS-API. It is used for data reading testing without sending the data out |
| CONNECTIONSTRING  | A secret **service** connection string provided by Azure IoT Hub to send energy data to cloud. Can be retrieve using Azure CLI. |



### Configure Devices and Project setting

There will be a config.json in the folder, this is when all the device will be configurated along the project details. 

This is the overall layout of the config.json:

```
{
	"ProjectName": "Testing",
	"Location": "101.1212, 112.1133",
	"AverageRT": 0
}
```

**Basic Setting of the project**

| Name        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| ProjectName | The project name given to this group of energy data.         |
| Location    | A string representative of the project location, it should be the longitude and latitude of the GPS location |
| AverageRT   | Set the average RT                                           |

### Start the application

Just run the start.bat if using windows system

OR



```
npm install
node pull.js
```

### NOTE
Only collect data being pushed after this server runs.
Please refer to this sdk https://github.com/epc-blockchain/MQTT-Push-Azure to push data to Azure IoT Hub

