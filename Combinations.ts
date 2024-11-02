// Create a list of the number of bits set at each corresponding index, upto the maximum number of items that may be selected
// [ 0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, ... ]
// i.e. [0] => 0, [1] => 1, [2] => 1, [3] => 2, ..., [333] => 5, ... (i.e. 333 === 101001101 has 5 bits set)
const createSetBitsLookup = (n: number) => {
  const nextValues = (x: number) => [x, x + 1, x + 1, x + 2];

  let lookupTable = nextValues(0);          // Starting values { 0, 1, 1, 2 }
  for (let i = 2, tableSize = 4; i < n; i++, tableSize <<= 1) {
    for (let j = 0, offset = tableSize >> 2; j < (tableSize >> 1) - offset; j++) {
      lookupTable = [...lookupTable, ...nextValues(lookupTable[j + offset])];
    }
  }

  return lookupTable;
};

// Create 2D bit flag arrays, indexed by population counts
// [  0: undefined,
//    1: [ 1, 2, 4, 8 ],
//    2: [ 3, 5, 6, 9, 10, 12 ],
//    3: [ 7, 11, 13, 14 ]        i.e. decimal numbers 7, 11, 13, 14 each have 3 bits set 
//    ...
// ]
const createIndexedPopulationCountsTable = (maxItemsToSelectFrom: number) => {
  const setBitsLookup = createSetBitsLookup(maxItemsToSelectFrom);

  const populationCountsTable: number[][] = [];
  for (let index = 1; index <= maxItemsToSelectFrom; index++) {
    populationCountsTable[index] = [];
    for (let bit = 0; bit < setBitsLookup.length; bit++) {  // Get indices of items with respective choices
      if (setBitsLookup[bit] === index) {
        populationCountsTable[index].push(bit);
      }
    }
  }

  return populationCountsTable;
};

// Select elements at corresponding bit flag
// e.g. from: [ 'a', 'b', 'c', 'd' ]
//      select by bit flag: 5
//      returns: [ 'a', 'c' ] i.e. a = 1, b = 2, c = 4
const selectElements = <T>(from: T[], bitFlag: number) => from.filter((_, index) => 1 << index & bitFlag);

const enumerateCombinations = (setBitsLookup: number[][]) =>
  <T>(from: T[]) =>
    (pick: number) => {
      const combinations: T[][] = [];

      // Get bit flags used to select the combinations from the lookup table, up to the number of items to select from
      const setBits = 1 << from.length;
      const lookupTable = setBitsLookup[pick];

      for (let index = 0; index < lookupTable.length; index++) {
        if (lookupTable[index] < setBits) {
          combinations.push(selectElements(from, lookupTable[index]));
        }
      }

      return combinations;
    };

export const combinationsReusingIndex = (maxItemsToSelectFrom: number) => {
  const populationCounts = createIndexedPopulationCountsTable(maxItemsToSelectFrom);
  return enumerateCombinations(populationCounts);
};

export const combinations = <T>(from: T[], pick: number) => combinationsReusingIndex(from.length)(from)(pick);
