let helper = require("./helper");

/**
 * Check to see if Mitsuba Frame 2 data was transmitted and return a boolean
 *
 * @param {number} address
 * @param {number} ID
 * @param {number[]} data
 * @returns {Boolean}
 */
exports.check = function check(address, ID, data) {
  return helper.addressCheck(
    address == helper.TELEMETRY_ADDRESS.MITSUBAFRAME2,
    () => {
      helper.sendData("mitsubaframe2", {
        ID: ID,
        adSensorError: data[0] & (1 << 0),
        motorCurrSensorUError: data[0] & (1 << 1),
        motorCurrSensorWError: data[0] & (1 << 2),
        fetThermError: data[0] & (1 << 3),
        battVoltSensorError: data[0] & (1 << 5),
        battCurrSensorError: data[0] & (1 << 6),
        battCurrSensorAdjError: data[0] & (1 << 7),

        motorCurrSensorAdjError: data[1] & (1 << 0),
        accelPosError: data[1] & (1 << 1),
        contVoltSensorError: data[1] & (1 << 3),

        powerSystemError: data[2] & (1 << 0),
        overCurrError: data[2] & (1 << 1),
        overVoltError: data[2] & (1 << 3),
        overCurrLimit: data[2] & (1 << 5),

        motorSystemError: data[3] & (1 << 0),
        motorLock: data[3] & (1 << 1),
        hallSensorShort: data[3] & (1 << 2),
        hallSensorOpen: data[3] & (1 << 3),

        overHeatLevel: data[4] & 0x3,
      });
    }
  );
};
