const dataLink = require("./dataLink");

const bms = require("./lib/bms");
const gps = require("./lib/gps");
const imu = require("./lib/imu");
const mitsubaF0 = require("./lib/mitsubaFrame0");
const mitsubaF1 = require("./lib/mitsubaFrame1");
const mitsubaF2 = require("./lib/mitsubaFrame2");
const proton1 = require("./lib/proton1");

/**
 * Handles a raw transmission from the data link layer and does needed calls
 *
 * @param {Number[]} data a single transmission
 */
function handleTransmission(data) {
  //get number of messages
  var numMessages = data[0];
  var currentIndex = 1;

  for (var message = 0; message < numMessages; message++) {
    //get start address
    var address = data[currentIndex++];
    //get the id
    var ID = data[currentIndex++];
    //get data length
    var dataLen = data[currentIndex++];

    //fill data in buffer
    var dataBuffer = [];
    for (var count = 0; count < dataLen; count++)
      dataBuffer.push(data[currentIndex++]);

    //check to see if addresses have been found & POST the data accordingly
    if (bms.check(address, ID, dataBuffer)) {
    } else if (gps.check(address, ID, dataBuffer)) {
    } else if (imu.check(address, ID, dataBuffer)) {
    } else if (proton1.check(address, ID, dataBuffer)) {
    } else if (mitsubaF0.check(address, ID, dataBuffer)) {
    } else if (mitsubaF1.check(address, ID, dataBuffer)) {
    } else if (mitsubaF2.check(address, ID, dataBuffer)) {
    }
  }
}

/**
 * Reads a single byte in, sends it to the data link layer which trickles back up
 *
 * @param {Number} byteIn a single byte from a transmission
 */
function read(byteIn) {
  dataLink.read(byteIn, handleTransmission);
}

exports.read = read;
exports.handleTransmission = handleTransmission;
