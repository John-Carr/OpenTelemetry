let { handleTransmission } = require("../src/network");
let { TELEMETRY_ADDRESS } = require("../src/lib/helper");
var ServerMock = require("mock-http-server");

var { expect } = require("chai");

describe("Network Layer", function () {
  // Run an HTTP server on localhost:9000
  var server = new ServerMock({ host: "localhost", port: 8080 });

  beforeEach(function (done) {
    server.start(done);
  });

  afterEach(function (done) {
    server.stop(done);
  });

  describe("Send BMS packSumVoltage data", function () {
    it("should POST /api/bms", (done) => {
      server.on({
        method: "*",
        path: "/api/bms",
        reply: {
          status: 200,
          headers: { "content-type": "application/json" },
          body: function (req) {
            try {
              expect(req.method).to.equal("POST");
              expect();
            } catch (error) {
              done(error);
              return JSON.stringify({ action: "read" });
            }
            done();
            return JSON.stringify({ action: "read" });
          },
        },
      });

      handleTransmission([
        1,
        TELEMETRY_ADDRESS.BMS,
        0,
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
    });
  });
  describe("Send Mitsuba frame0 data", function () {
    it("should POST /api/mitsuba-frame0", (done) => {
      server.on({
        method: "*",
        path: "/api/mitsuba-frame0",
        reply: {
          status: 200,
          headers: { "content-type": "application/json" },
          body: function (req) {
            try {
              expect(req.method).to.equal("POST");
              expect();
            } catch (error) {
              done(error);
              return JSON.stringify({ action: "read" });
            }
            done();
            return JSON.stringify({ action: "read" });
          },
        },
      });
    });
    // TODO: Updated this to be mitsuba frame 0 data
    handleTransmission([
      1,
      TELEMETRY_ADDRESS.BMS,
      0,
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
  });
});
