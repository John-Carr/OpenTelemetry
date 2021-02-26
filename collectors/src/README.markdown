# Telemetry Collector Source Files

- `lib/` Contains library functions and specific telemetry collector implementations (ie. bms)

- `app.js` UART interface file, it coordinates the incoming transmissions

- `dataLink.js` Handles decoding the data link layer

- `network.js` Handles decoding the network layer and passing to the correct collector implementation
