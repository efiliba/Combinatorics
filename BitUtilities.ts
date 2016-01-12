interface IOnlyOptionResult {
    found: boolean;
    bit: number;
}

module Solver {
    export class BitUtilities {
        // Population count
        public static numberOfBitsSet(bits: number): number {
            var count: number = 0;
            while (bits) {
                bits &= bits - 1;
                count++;
            }

            return count;
        }

        // Return bits set within all passed elements (not XOR)
        public static bitwiseOR(elements: number[]): number {
            var totalOred: number = 0;
            for (var index: number = 0; index < elements.length; index++)
                totalOred |= elements[index];

            return totalOred;
        }

        // XOR all the values passed in to find an only option
        public static onlyOption(options: number[]): IOnlyOptionResult {
            var option: number = 0;
            var filled: number = 0;
            for (var index: number = 0; index < options.length; index++)
                if (options[index] & options[index] - 1) {                                          // Not a single base of 2 number (1, 2, 4, 8, ...)
                    filled |= option & options[index];
                    option ^= options[index];                                                       // XOR
                }

            option &= ~filled;
            return {
                found: option && !(option & option - 1),                                            // Single base of 2 number, but not 0
                bit: option
            }
        }

        // Index of first item in array containing bit
        public static containingBitIndex(array: number[], bit: number): number {
            var index: number = 0;
            while (!(array[index] & bit) && index < array.length)
                index++;

            return index;
        }
    }
}
