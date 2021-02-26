let helper = require("./helper");

/**
 * Check to see if Proton1 (MPPT) data was transmitted and return a boolean
 *
 * @param {number} address
 * @param {number[]} data
 * @returns {Boolean}
 */
exports.check = function check(address, ID, data) {
  return helper.addressCheck(address == helper.TELEMETRY_ADDRESS.MPPT, () => {
    let preArrayVoltage = (data[1] << 8) | data[0];
    let preArrayCurrent = (data[3] << 8) | data[2];
    let preBatteryVoltage = (data[5] << 8) | data[4];
    let preMpptTemperature = (data[7] << 8) | data[6];

    helper.sendData("proton1", {
      ID: ID,
      arrayVoltage: preArrayVoltage / 100,
      arrayCurrent: preArrayCurrent / 100,
      batteryVoltage: preBatteryVoltage / 100,
      mpptTemperature: preMpptTemperature / 100,
    });
  });
};
