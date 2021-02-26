var dataLink = require('../../src/dataLink')
var specialChars = dataLink.specialChars

/**
 * Gets data link transmittable array with start/end/escape characters
 * 
 * @param {number[]} dataIn
 * @returns {number[]} converts to array that data link can read
 */
module.exports = function send(dataIn) {
    var data = [specialChars.start]
    for (var index = 0; index < dataIn.length; index++)
    {
        var dataByte = dataIn[index]
        if (dataByte == specialChars.start || dataByte == specialChars.end || dataByte == specialChars.escape)
            data.push(specialChars.escape)
        
        data.push(dataByte)
    }

    data.push(specialChars.end)
    return data
}
