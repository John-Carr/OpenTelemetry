This project is 3 main parts: backend-http, backend-sockets, client
## Backend
This is for all of our standard updates.
* Creating vehicles
* Creating telemetry items
* Getting historical data
Hosted on port 5000
## Client
All the pretty stuff
Hosted on port 3000
### Telem Items
Telemetry Items are defined as such:
```json
// Telemetry Item
{
    "id": "Number",          // id received by the collector that tells the collector how to parse the data
    "name": "String",        // Name of the device that produces the data
    "description": "String", // A description of the device that produces the data
    "iso": "Enum",           // This is a value that will tell the collector to use a predefined decode method useful for things like GPS
                             // Setting this will automatically populate the values array
    "values": []             // A list of objects that represent the values that the device sends to the collector **in the order that the device sends it**
}
// Telemetry Item Values
{
    "name": "String",   // Name of the value such as Battery Voltage
    "units": "String",  // Units of the item
    "signed": "Bool",   // If the value should be treated as two's compliment
    "format": "Enum",   // method the collector will use to parse the value [unaligned, unaligned bool, bool, 8, 16, 32, 64, IEEE Float]
                        // unaligned bool is a bool that is packed it will only refrence one bit make sure to set padded if the other values are don't care.
                        // bool refrences the whole byte and will return true if the value is greater than 0.
    "padded": "Bool",   // Used if the value is unaligned, if the value is unaligned but zero padded this will tell the collector to realign for the next parse
    "scalar": "Number", // Number to multiply the value by once it is parsed
    "mask": [2],        // Used in unaligned format, the upper an lower byte will be ANDed by these numbers respectively
    "isEnum": "Bool",   // If the value should be enumerated
    "enum": [],         // Array of strings that can be refrenced if the data is an enum
    "bytes:": "Number"  // Used in unaligned format, the number of bytes that the value spans
}
```
### Homepage
Routed at `/`
### Create Vehicle Page
### Active Sessions
#### Pit stop assignments
### Inventory