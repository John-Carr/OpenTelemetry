# Telemetry Collector

All communications from the vehicle come over the RFD900x module which reports UART back to us. This repository is the software responsable for decoding the message after it is sent over UART and sending it to the correct endpoint on our [GUI Server](https://github.com/Solar-Gators/Pit-GUI).

Please refer to the  [telemetry-collector documentation on readthedocs](https://solar-gators-docs.readthedocs.io/en/latest/Telemetry/receiver.html).
