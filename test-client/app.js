const io = require("socket.io-client");
const socket = io(`http://localhost:5000/live`);
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
// Copy the templates
var BMS_Data = JSON.parse(JSON.stringify(BMS_temp));
var MPPT0_Data = JSON.parse(JSON.stringify(MPPT_temp));
var MPPT1_Data = JSON.parse(JSON.stringify(MPPT_temp));
// going to emit stuff to see on the front end
MPPT0 = setInterval(() => emitData(socket, MPPT0_Data, 1), 5000);
MPPT1 = setInterval(() => emitData(socket, MPPT1_Data, 2), 5000);
BMS = setInterval(() => emitData(socket, BMS_Data, 3), 5000);
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
