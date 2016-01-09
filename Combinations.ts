module Solver {
    export interface ICombinations<T> {
        select(from: T[], pick: number): T[][];
    }

    export class Combinations<T> implements ICombinations<T> {
        private setBitsLookupTable: number[][];                                                     // Lookup table of the integers with the indices number of bits set i.e. [2] = 3, 5, 6, ... (011, 101, 110 have 2 set bits)

        constructor(maxItemsSelectFrom: number) {
            var setBits: number[] = this.createSetBitsLookup(maxItemsSelectFrom);

            this.setBitsLookupTable = [];
            for (var index: number = 1; index < maxItemsSelectFrom; index++) {
                this.setBitsLookupTable[index] = [];
                for (var bit: number = 0; bit < setBits.length; bit++)                              // Get indices of items with respective choices
                    if (setBits[bit] === index)
                        this.setBitsLookupTable[index].push(bit);
            }
        }

        public select(from: T[], pick: number): T[][] {
            var combinations: T[][] = [];

            // Get bit flags used to select the combinations from the lookup table, up to the number of items to select from
            var setBits = 1 << from.length;
            var lookupTable = this.setBitsLookupTable[pick];

            for (var index: number = 0; index < lookupTable.length; index++)
                if (lookupTable[index] < setBits)
                    combinations.push(this.selectElements(from, lookupTable[index]));

            return combinations;
        }

        // Return elements where the index is in the select bit flag
        private selectElements(from: T[], select): T[] {
            //SelectElementsDelegate<T> selectElements = (elements, select) => { return elements.Where((x, i) => (1 << i & select) > 0); };
            var elements: T[] = [];
            for (var index: number = 0; index < from.length; index++)
                if (1 << index & select)
                    elements.push(from[index]);

            return elements;
        }

        // Populate array with the number of bits set i.e. [0] => 0, [1] => 1, [2] => 1, [3] => 2, ..., [333] => 5 (i.e. 101001101 has 5 bits set)
        private createSetBitsLookup(n: number): number[] {
            var nextValues: (x: number) => number[];
            nextValues = (x) => [x, x + 1, x + 1, x + 2];

            var lookupTable: number[] = nextValues(0);                                              // Starting values { 0, 1, 1, 2 }
            for (var i: number = 2, tableSize: number = 4; i < n; i++, tableSize <<= 1)
                for (var j: number = 0, offset: number = tableSize >> 2; j < (tableSize >> 1) - offset; j++)
                    // lookupTable.InsertRange(tableSize + (j << 2), nextValues(lookupTable[j + offset]));
                    Array.prototype.splice.apply(lookupTable, [tableSize + (j << 2), 0].concat(nextValues(lookupTable[j + offset])));

            return lookupTable;
        }
    }
}
