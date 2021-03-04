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
      // Variable for reading the data
      let index = 0;
      // Object to respond with
      let resObj = {};
      // check if its a cutom pre implimented decode logic (ISO)
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
      // decode the data
      for (let val in res.data.values) {
        // destructure the res values
        let {
          enumVals,
          isEnum,
          signed,
          padded,
          format,
          scalar,
          name,
          mask,
        } = res.data.values[val];
        // variable for holding the value of that value
        let res = 0;
        // check if the value is unaligned
        if (format.search("unaligned") >= 0) {
          // check to see if we are dealing with an unaligned bool
          if (format.search("bool") >= 0) {
            //Deal with the byte
            res = res & mask[0];
          } else {
            // determine the amount we need to shift
            let shift = mask[0].toString(2).match(/1/g).length;
            // we update index here but need to ensure that the MSB is either all used (used or dont care)
            // or we keep index at the same size
            // TODO needs to be tested
            res = data[index] >> (8 - shift);
            index++;
            for (let i = 1; i < length; i++) {
              // handle msb
              if (i === length - 1) {
                res =
                  ((data[index] & mask[mask.length - 1]) <<
                    (8 * i - (8 - shift))) |
                  res;
              }
              // handle all the bytes in between
              else {
                res = (data[index] << (8 * i - (8 - shift))) | res;
              }
              index++;
            }
            // if the whole upper byte is used or if padded increment the index
            if (mask[1] !== 0xff || !padded) {
              index--;
            }
            // If the item is not an enum multiply by the scalar
            if (!isEnum) {
              res = res * scalar;
            }
          }
        } else if (format === "bool") {
          res = dataBuffer[index++] > 0;
        } else if (signed) {
          // If the data is signed parse the data
          let temp = "";
          // Create the binary string
          for (let i = 0; i < parseInt(format); i++) {
            temp = dataBuffer[index++].toString(2) + temp;
          }
          res = helper.toSigned(temp);
        } else if (format === "IEE Float") {
          console.log("Not Implimented");
        } else {
          let temp = "";
          // Create the binary string
          for (let i = 0; i < parseInt(format); i++) {
            temp = dataBuffer[index++].toString(2) + temp;
          }
          res = parseInt(temp, 2);
        }
        // Parse the enum value
        if (isEnum) {
          res = helper.parseEnum(enumVals, res);
        } else {
          res *= scalar;
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
