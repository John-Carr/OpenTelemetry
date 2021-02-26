var dataLinkCovert = require("./lib/dataLinkConvert");
let network = require("../src/network");
let helper = require("../src/lib/helper");

describe("Send a transmission", function () {
  it("should not error", () => {
    let packet = dataLinkCovert([
      1,
      helper.TELEMETRY_ADDRESS.BMS,
      8,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      80,
    ]);
    for (let data of packet) {
      network.read(data);
    }
  });
});
