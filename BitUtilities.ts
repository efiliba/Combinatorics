// Population count
export const numberOfBitsSet = (bits: number) => {
  let count = 0;
  while (bits) {
    bits &= bits - 1;
    count++;
  }

  return count;
};

// Return bits set within all passed elements (not XOR)
export const bitwiseOR = (elements: number[]) => {
  let totalOred = 0;
  for (let index = 0; index < elements.length; index++)
    totalOred |= elements[index];

  return totalOred;
};

// XOR all the values passed in to find an only option
export const onlyOption = (options: number[]) => {
  let option = 0;
  let filled = 0;
  for (let index = 0; index < options.length; index++)
    if (options[index] & options[index] - 1) {                                          // Not a single base of 2 number (1, 2, 4, 8, ...)
      filled |= option & options[index];
      option ^= options[index];                                                       // XOR
    }

  option &= ~filled;
  return {
    found: option > 0 && !(option & option - 1),                                            // Single base of 2 number, but not 0
    bit: option
  }
};

// Index of first item in array containing bit
export const containingBitIndex = (array: number[], bit: number) => {
  let index = 0;
  while (!(array[index] & bit) && index < array.length)
    index++;

  return index;
};
