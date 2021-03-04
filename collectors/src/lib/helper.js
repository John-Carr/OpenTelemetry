const request = require("axios");
const config = require("config");

/**
 * Telemetry Addresses
 */
exports.TELEMETRY_ADDRESS = {
  GPS: 0x00,
  MPPT: 0x01,
  BMS: 0x02,
  IMU: 0x03,
  MITSUBAFRAME0: 0x04,
  MITSUBAFRAME1: 0x05,
  MITSUBAFRAME2: 0x06,
};

/**
 * Sends data to the backend to be logged
 *
 * Examples:
 * ```JavaScript
 * sendData("bms", {
 *     "packSumVoltage": 20
 * })
 * ```
 *
 * ```JavaScript
 * sendData("gps", {
 *     "longitude": 1,
 *     "latitude": -1,
 *     "speed": 5,
 *     "heading": 40
 * })
 * ```
 *
 * @param {String} url  url to route
 * @param {{}} data data to send to route
 */
exports.sendData = function sendData(url, data) {
  return request.post(`${config.get("server.url")}/api/${url}`, data);
};

/**
 * Converts from Degrees Decimal Minutes (DDM) to Decimal Degree (DD) coordinates
 *
 * DDM Format: DDMM.MMMM
 * DD Format: DD.DDDDDD
 * Example:
 * ```JavaScript
 * DDMtoDD(" -8220.366364") //returns -82.3394394
 * ```
 * @param {String} str DDM coordinates
 */
exports.DDMtoDD = function DDMtoDD(str) {
  //get degrees
  var degrees = parseFloat(str[0] + str[1] + (str[0] == "-" ? str[3] : ""));
  var minStr = "";
  for (var index = str[0] == "-" ? 3 : 2; index < str.length; index++) {
    minStr += str[index];
  }

  return degrees + (parseFloat(minStr) / 60) * (str[0] == "-" ? -1 : 1);
};

/**
 * Converts two 8 bit number to a 16 bit unsigned number
 *
 * @param {Number} top    most sigificant byte
 * @param {Number} bottom least significant byte
 */
exports.getWord = function getWord(top, bottom) {
  return (top << 8) | bottom;
};

/**
 * Converts two 8 bit number to a 16 bit signed number
 *
 * @param {Number} top    most sigificant byte
 * @param {Number} bottom least significant byte
 */
exports.signed16 = function signed16(top, bottom) {
  var sign = top & (1 << 7);
  var x = ((top & 0xff) << 8) | (bottom & 0xff);
  if (sign) return 0xffff0000 | x; // fill in most significant bits with 1's

  return x;
};
/**
 * converts a binary number from a string to a twos compliment number
 *
 * @param {String} binary string representation of the twos compliment number
 * @return {Number} The parsed number
 */
exports.toSigned = function toSigned(binary) {
  while (binary.length <= 32) {
    binary = binary[0] + binary;
  }
  return ~~parseInt(binary, 2);
};
/**
 *
 * @param {Array} arr Array of values to search through
 * @param {Number} num Number to search for
 * @return The string equivalent
 */
exports.parseEnum = function parseEnum(arr, num) {
  let res = arr.find((item) => {
    item.num === num;
  });
  if (res) return res.name;
  else return "undefined";
};
/**
 * If condition is true then run callback. Always return condition
 *
 * Examples:
 * ```JavaScript
 * addressCheck(true, () => console.log("Prints")) //Out: Prints
 *
 * addressCheck(false, () => console.log("Does not Print")) //Out: Does not Print
 * ```
 *
 * @param {boolean} condition
 * @param {Function} callback
 * @returns {boolean}
 */
exports.addressCheck = function addressCheck(condition, callback) {
  if (condition) {
    callback();
  }
  return condition;
};
