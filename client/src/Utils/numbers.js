export function isHexOrDec(input) {
  if (input === "") return true;
  // if the number is just decimal
  // eslint-disable-next-line
  if (input == parseInt(input)) {
    return true;
  }
  // check to see if input is hex
  // check if the first two chars are 0x
  if (
    input.charAt(0) === "0" &&
    (input.charAt(1) === "x" || input.charAt(1) === "X")
  ) {
    if (input.length === 2) {
      return true;
    }
    let subStr = input.slice(2);
    // eslint-disable-next-line
    if (subStr == parseInt(input)) {
      return true;
    }
    return false;
  }
}
