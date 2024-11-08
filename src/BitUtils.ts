/**
 * Population count - count the number of bits set
 * @param bits Base 10 number
 * @returns Total of the bits set in its binary representation
 * @example
 * ```ts
 * numberOfBitsSet(333); // 5 i.e. 333 = 101001101 i.e. 5 bits set
 * ```
 */
export const numberOfBitsSet = (bits: number): number => {
  let count = 0;
  while (bits) {
    bits &= bits - 1;
    count++;
  }

  return count;
};

/**
 * Find distinct bits set within all the passed elements (not XOR)
 * @param elements The array of numbers whose binary bits are set
 * @returns The decimal number representing the distinct set bits
 * @example
 * ```ts
 * const elements = [2, 6, 12]; // 0010 | 0110 | 1100 = 1110
 * bitwiseOR(elements); // 14
 * ```
 */
export const bitwiseOR = (elements: number[]): number => {
  let totalOred = 0;
  for (let index = 0; index < elements.length; index++)
    totalOred |= elements[index];

  return totalOred;
};

/**
 * XOR all the values passed in to find an only option, if any
 * @param options The array of numbers to search for an only option
 * @returns An object with found and the index of the only set bit 
 * @example 
 * ```ts
 * const xorBits = [5, 6, 9, 12]; // 0101 ^ 0110 ^ 1001 ^ 1100 = 0010
 * onlyOption(xorBits); // { found: true, bit: 2 }
 * ```*/
export const onlyOption = (options: number[]): { found: boolean; bit: number; } => {
  let option = 0;
  let filled = 0;
  for (let index = 0; index < options.length; index++)
    if (options[index] & options[index] - 1) {    // Not a single base of 2 number (1, 2, 4, 8, ...)
      filled |= option & options[index];
      option ^= options[index];                   // XOR
    }

  option &= ~filled;
  return {
    found: option > 0 && !(option & option - 1),  // Single base of 2 number, but not 0
    bit: option
  }
};

/**
 * Find the index of the first item in the array containing the bit
 * @param array The array of numbers to search for the first set bit
 * @param bit The bit to search for
 * @returns The index of the first item of the matched bit
 * @example
 * ```ts
 * const array = [0, 2, 3, 4]; // 000, 010, 011, 100
 * containingBitIndex(array, 1); // 2 Index of first item that has bit 1 set
 * ```*/
export const containingBitIndex = (array: number[], bit: number): number => {
  let index = 0;
  while (!(array[index] & bit) && index < array.length)
    index++;

  return index;
};
