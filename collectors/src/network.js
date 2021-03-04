const { default: axios } = require("axios");
const io = require("socket.io-client");
const socket = io(`http://localhost:5000/live`);
const dataLink = require("./dataLink");
const helper = require("./lib/helper");

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
    // Get the decode logic for the data
    axios.get(`api/telemItem/6969/${address}`).then((res) => {
      console.log(res);
      let index = 0;
      let resObj = {};
      // check if the shit is GPS cause that aint in yet
      if (res.data.iso) {
        if (res.data.iso === "GPS") {
          var gpsString = "";
          for (var index = 0; index < data.length; index++)
            gpsString += String.fromCharCode(data[index]);
          //var gpsString = data.join('')
          var values = gpsString.split(",");

          //north and east is positive
          var longitudeStr = values[1];
          var latitudeStr = values[0];

          var longitude = String(
            parseFloat(longitudeStr) *
              (longitudeStr[longitudeStr.length - 1] == "W" ? -1 : 1)
          );
          var latitude = String(
            parseFloat(latitudeStr) *
              (latitudeStr[latitudeStr.length - 1] == "S" ? -1 : 1)
          );
          var speed = parseFloat(values[2]);
          var heading = parseFloat(values[3]);
          socket.emit("new data", {
            ID: ID,
            longitude: helper.DDMtoDD(longitude),
            latitude: helper.DDMtoDD(latitude),
            speed: speed,
            heading: heading,
            room: 1,
          });
          // Return because we are done dealing with the data
          return;
        }
      }
      // decode the rest of the data
      for (let val in res.data.values) {
        let { length, dataType, scalar, name, custom } = res.data.values[val];
        let res = 0;
        // check if the value is custom and needs to be bit modified
        if (custom.length > 0) {
          // check to see if we are dealing with one byte
          if (custom.length === 1) {
            //Deal with the byte
            res = res & custom[0];
          } else {
            // determine the amount we need to shift
            let shift = custom[0].toString(2).match(/1/g).length;
            // we update index here but need to ensure that the MSB is either all used (used or dont care)
            // or we keep index at the same size
            // TODO does not handle dont cares they must be zero padded
            // TODO needs to be tested
            res = data[index] >> (8 - shift);
            index++;
            for (let i = 1; i < length; i++) {
              // handle msb
              if (i === length - 1) {
                res =
                  ((data[index] & custom[custom.length - 1]) <<
                    (8 * i - (8 - shift))) |
                  res;
              }
              // handle all the bytes in between
              else {
                res = (data[index] << (8 * i - (8 - shift))) | res;
              }
              index++;
            }
            // if full last byte is not used then decrement index TODO byte padding
            if (custom[0] !== 0xff) {
              index--;
            }
            res = res * scalar;
          }
        } else if (length === 2 && dataType === "unsigned") {
          res =
            helper.getWord(dataBuffer[index++], dataBuffer[index++]) * scalar;
        } else if (length === 2 && dataType === "signed") {
          res =
            helper.signed16(dataBuffer[index++], dataBuffer[index++]) * scalar;
        } else if (length === 2 && dataType === "decimal") {
          res =
            helper.getWord(dataBuffer[index++], dataBuffer[index++]) * scalar;
        }
        resObj[name] = res;
      }
      // emit a socket event that we have new data
      // TODO need the car address
      socket.emit("new data", {
        id: ID,
        data: resObj,
        time: new Date(),
        room: 1,
      });
    });
    //check to see if addresses have been found & POST the data accordingly
    // if (bms.check(address, ID, dataBuffer)) {
    // } else if (gps.check(address, ID, dataBuffer)) {
    // } else if (imu.check(address, ID, dataBuffer)) {
    // } else if (proton1.check(address, ID, dataBuffer)) {
    // } else if (mitsubaF0.check(address, ID, dataBuffer)) {
    // } else if (mitsubaF1.check(address, ID, dataBuffer)) {
    // } else if (mitsubaF2.check(address, ID, dataBuffer)) {
    // }
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
