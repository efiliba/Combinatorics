import { C } from "./Utils.ts";
import { IndicesBuilder } from "./IndicesBuilder.ts";

// Pad args e.g. 4 => [4, 1] i.e. pick 4 of a kind and then 1 of a kind from remaining options
const formatPicked = (numberToPick: number, args: number | number[]) => {
  let picked: Uint8Array;
  let pickIndex: number;
  if (args instanceof Array) {
    const totalArgs = args.reduce((total, arg) => total + arg);
    picked = new Uint8Array(args.length + numberToPick - totalArgs);

    for (pickIndex = 0; pickIndex < args.length; pickIndex++) {
      let largestIndex = 0;

      for (let argsIndex = 0; argsIndex < args.length; argsIndex++) {
        if (args[argsIndex] > args[largestIndex]) {
          largestIndex = argsIndex;
        }
      }

      picked[pickIndex] = args[largestIndex];
      args[largestIndex] = 0;
    }
  } else {
    picked = new Uint8Array(numberToPick - args + 1);
    picked[0] = args;
    pickIndex = 1;
  }

  while (pickIndex < picked.length) {
    picked[pickIndex++] = 1;
  }

  return picked;
};

const count = (columns: number, rows: number, fromGrid: Uint8Array[], givenGrid: Uint8Array[], pick: Uint8Array) =>
  // Main recursive function to count combinations
  function countCombinations(totalLeftToPick: number, pickIndex: number) {
    if (pickIndex >= pick.length) {             // Ensure enough indices left to pick 
      return totalLeftToPick ? 0 : 1;           //   'Fell off' this recursive branch -> do not include in calculations
    }

    let total = 0;
    for (let index = 0; index < columns; index++) {
      const pickAmt = pick[pickIndex] - givenGrid[rows][index];
      const fromAmt = fromGrid[rows][index];
      if (pickAmt <= totalLeftToPick && fromAmt && pickAmt >= 0) {

        fromGrid[rows][index] = 0;              // Temporarily remove indices fromGrid options, for next recursive call
        total += C(fromAmt, pickAmt) * countCombinations(totalLeftToPick - pickAmt, pickIndex + 1);
        fromGrid[rows][index] = fromAmt;
      }
    }

    return total;
  };

// Count the number of combinations that are duplicate
const repeatedPicks = (pick: Uint8Array) => {
  let total = 1;
  let repeated = 1;
  let current = 0;

  while (++current < pick.length) {
    total *= pick[current - 1] == pick[current] ? ++repeated : (repeated = 1);
  }

  return total;
};

export const numberOfWaysUsingIndices = ({ columns, rows, fromGrid, givenGrid, numberToPick = rows }: {
  columns: number;
  rows: number;
  fromGrid: Uint8Array[];
  givenGrid: Uint8Array[];
  numberToPick?: number;
}): (args: number | number[]) => number =>
  (args: number | number[]) => {
    const pick = formatPicked(numberToPick, args);
    const combinations = count(columns, rows, fromGrid, givenGrid, pick);

    return combinations(numberToPick - givenGrid[rows][columns], 0) / repeatedPicks(pick);
  };

/**
 * Get the total number of ways that items can be selected (order not important)
 * @param from - Uint8Array of items to select 'from'
 * - Example decks of cards new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52)
 * -   Duplicate values to add multiples
 * -   Leave out unwanted items
 * @param numberOfColumns - group items by 'kinds'
 * - Example 13 for a standard deck of cards
 * @param numberToPick - number of items to pick
 * - Example 5 for a card 'hand'
 * @param given (optional) - Uint8Array of items that must be included
 * - Example 'given' suited (on same row) Ace King: new Uint8Array([0, 12]))
 * @returns function that returns the number of ways of selecting n1 items, followed by n2 items, ...
 * - Example number of FullHouses select([3, 2])
 * --  Select 3 of a kind and then 2 of a kind from the remaining cards
 */
export const numberOfWays = (
  from: Uint8Array,
  numberOfColumns: number,
  numberToPick = from.length / numberOfColumns, // Default - select all i.e. row
  given: Uint8Array = new Uint8Array()
): (args: number | number[]) => number =>
  numberOfWaysUsingIndices({ ...IndicesBuilder(from, numberOfColumns, given), numberToPick });
