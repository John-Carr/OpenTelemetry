let helper = require("./helper");

/**
 * Check to see if BMS data was transmitted and return a boolean
 *
 * @param {number} address
 * @param {number} ID
 * @param {number[]} data
 * @returns {Boolean}
 */
exports.check = function check(address, ID, data) {
  return helper.addressCheck(
    address == helper.TELEMETRY_ADDRESS.BMS && data[7] && data[6],
    () => {
      helper.sendData("bms", {
        ID: ID,
        LowCellVoltage: helper.getWord(data[1], data[0]) / 100,
        highCellVoltage: helper.getWord(data[3], data[2]) / 100,
        avgCellVoltage: helper.getWord(data[5], data[4]) / 100,
        packSumVoltage: helper.getWord(data[7], data[6]) / 100,
      });
    }
  );
};
