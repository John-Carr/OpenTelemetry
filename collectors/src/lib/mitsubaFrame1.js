let helper = require("./helper");

/**
 * Check to see if Mitsuba Frame 1 data was transmitted and return a boolean
 *
 * @param {number} address
 * @param {number} ID
 * @param {number[]} data
 * @returns {Boolean}
 */
exports.check = function check(address, ID, data) {
  return helper.addressCheck(
    address == helper.TELEMETRY_ADDRESS.MITSUBAFRAME1,
    () => {
      let preAccelPos = ((data[1] & 0xf) << 6) | (data[0] >> 2);
      let preRegenVRposition = ((data[2] & 0x3f) << 4) | (data[1] >> 4);
      let preDigitSWposition = ((data[3] & 0x3) << 2) | (data[2] >> 6);
      let preOutTargetVal = ((data[4] & 0xf) << 6) | (data[3] >> 2);
      helper.sendData("mitsubaframe1", {
        ID: ID,
        powerMode: data[0] & 1,
        MCmode: (data[0] >> 1) & 1,
        AcceleratorPosition: preAccelPos,
        regenVRposition: preRegenVRposition,
        digitSWposition: preDigitSWposition,
        outTargetVal: preOutTargetVal,
        driveActStat: (data[4] >> 4) & 3,
        regenStat: (data[4] >> 6) & 1,
      });
    }
  );
};
