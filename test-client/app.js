const io = require("socket.io-client");
const socket = io(`http://localhost:5000/live`);
const fs = require("fs");
// Generate semi good looking data
function generateRandom(prevVal, range, max, min) {
  let num = Math.floor(Math.random() * range);
  let up = Math.random() < 0.5;
  let ret;
  if (up) {
    ret = prevVal + num;
    ret = ret > max ? max : ret;
  } else {
    ret = prevVal - num;
    ret = ret < min ? min : ret;
  }
  return ret;
}
// Templates
let MPPT_temp = {
  "Array Voltage": 50,
  "Array Current": 10,
  "Battery Voltage": 100,
  "MPPT Temperature": 40,
};
let BMS_temp = {
  "Low Cell Voltage": 3.8,
  "High Cell Voltage": 4,
  "Avg Cell Voltage": 3,
  "Pack Sum Voltage": 90,
};
locations = ["test1.txt"];
locations.forEach((fname) => {
  console.log(`Reading ${fname}...`);
  let data = fs.readFileSync(`./${fname}`, "utf-8");
  texts.push(data);
});
let coords = [];
for (const entry in texts) {
  if (texts.hasOwnProperty(entry)) {
    const raw = texts[entry];
    processData(raw, coords);
  }
}
// Copy the templates
var BMS_Data = JSON.parse(JSON.stringify(BMS_temp));
var MPPT0_Data = JSON.parse(JSON.stringify(MPPT_temp));
var MPPT1_Data = JSON.parse(JSON.stringify(MPPT_temp));
// going to emit stuff to see on the front end
MPPT0 = setInterval(() => emitData(socket, MPPT0_Data, 1), 5000);
MPPT1 = setInterval(() => emitData(socket, MPPT1_Data, 2), 15000);
BMS = setInterval(() => emitData(socket, BMS_Data, 3), 15000);
GPS = setInterVal(() => emitGPSData(socket, coords, 4), 5000);
//
const emitData = (socket, template, id) => {
  let room = 1;
  for (var key in template) {
    if (template.hasOwnProperty(key)) {
      template[key] = generateRandom(template[key], 5, 100, 0);
    }
  }
  socket.emit("new data", {
    id: id,
    data: template,
    time: new Date(),
    room: room,
  });
};
var index = 0;
const emitGPSData = (socket, gpsData, id) => {
  let template = {
    id: id,
    lng: gpsData[index].lng,
    lat: gpsData[index].lat,
    heading: 90,
    speed: 100,
  };
  index++;
  socket.emit("new data", {
    id: id,
    data: template,
    time: new Date(),
    room: 1,
  });
};
function processData(allText, out) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(",");
  let index = out.push([]);
  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(",");
    if (data.length == headers.length) {
      out[index - 1].push({ lng: data[0], lat: data[1] });
    }
  }
}
