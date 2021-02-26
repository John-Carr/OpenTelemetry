let helper = require("./helper");

/**
 * Check to see if IMU data was transmitted and return a boolean
 *
 * @param {number} address
 * @param {number} ID
 * @param {number[]} data
 * @returns {boolean}
 */
exports.check = function check(address, ID, data) {
  return helper.addressCheck(address == TELEMETRY_ADDRESS.IMU, () => {
    var accel = {
      x: signed16(data[1], data[0]),
      y: signed16(data[3], data[2]),
      z: signed16(data[5], data[4]),
    };

    var gyro = {
      x: signed16(data[7], data[6]),
      y: signed16(data[9], data[8]),
      z: signed16(data[11], data[10]),
    };
    var linear = {
      x: signed16(data[13], data[12]),
      y: signed16(data[15], data[14]),
      z: signed16(data[17], data[16]),
    };
    var temp = signed16(data[19], data[18]);

    // console.log("--------- PACKET START ---------")
    // console.log("accel : ", accel)
    // console.log("gyro : ", gyro)
    // console.log("linear : ", gyro)
    // console.log("temp : ", temp, "C")
    // console.log("--------- PACKET END ---------")
  });
};
