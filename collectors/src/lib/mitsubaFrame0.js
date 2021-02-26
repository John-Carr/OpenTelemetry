let helper = require("./helper");

/**
 * Check to see if Mitsuba Frame 0 data was transmitted and return a boolean
 *
 * @param {number} address
 * @param {number} ID
 * @param {number[]} data
 * @returns {Boolean}
 */
exports.check = function check(address, ID, data) {
  return helper.addressCheck(
    address == helper.TELEMETRY_ADDRESS.MITSUBAFRAME0,
    () => {
      let preBattVoltage = ((data[1] & 3) << 8) | data[0];
      let preBattCurrent = ((data[2] & 7) << 6) | (data[1] >> 2);
      let preMotorCurrent = ((data[3] & 0x3f) << 4) | (data[2] >> 4);
      let preFETtemp = ((data[4] & 7) << 2) | (data[3] >> 6);
      let preMotorRPM = ((data[5] & 0x7f) << 5) | (data[4] >> 3);
      let preDuty = ((data[7] & 1) << 9) | (data[6] << 1) | (data[5] >> 7);
      helper.sendData("mitsubaFrame0", {
        ID: ID,
        battVoltage: preBattVoltage,
        battCurrent: preBattCurrent,
        battCurrentDir: data[2] & 8,
        motorCurrentPkAvg: preMotorCurrent,
        FETtemp: preFETtemp,
        motorRPM: preMotorRPM,
        PWMDuty: preDuty,
        LeadAngle: data[7] >> 1,
      });
    }
  );
};
