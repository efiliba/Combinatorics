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

/**
 * Optimised version (re-using IndicesBuilder) to get the total of the number of ways to select items
 * @param columns The number of indices to partition the grids by i.e. 13 'kinds' in a deck
 * @param rows The number of indices to partition the items into i.e. 4 'suits' in a deck
 * @param fromGrid A 2D grid of Uint8Array[] options to select from
 * @param givenGrid A 2D grid of Uint8Array[] indices that must be included in results
 * @param numberToPick The number of items to pick
 * @returns curried function for the number of ways of selecting n1 items, followed by n2, ...
 * @example
 * ```ts
 * const cards = decksBuilder(); // Utility function to create a deck
 * const { columns, rows, fromGrid, givenGrid } = IndicesBuilder(cards, 13);
 * const select = numberOfWays_UsingIndices({ columns, rows, fromGrid, givenGrid, numberToPick: 5 });
 * ```
 */
export const numberOfWays_UsingIndices = ({ columns, rows, fromGrid, givenGrid, numberToPick = rows }: {
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
 * @param from An Uint8Array of items to select 'from'
 * - Duplicate values to add multiples
 * - Leave out unwanted items
 * @example multiple decks of cards 
 * ```ts
 * new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52)
 * ```
 * @param numberOfColumns The number of groups of items e.g. 'kinds' of cards A, 2, ...
 * @example 13 for a standard deck of cards
 * @param numberToPick The number of items to pick
 * @example 5 for a card 'hand'
 * @param given (optional) An Uint8Array of items that must be included
 * @example 'given' Ace King - suited (on same row)
 * ```ts
 * new Uint8Array([0, 12]))
 * ```
 * @returns function that returns the number of ways of selecting n1 items, followed by n2, ...
 * @example number of Full Houses - Select 3 of a kind and then 2 of a kind from the remaining cards
 * ```ts
 * select([3, 2])
 * ``` 
 */
export const numberOfWays = (
  from: Uint8Array,
  numberOfColumns: number,
  numberToPick = from.length / numberOfColumns, // Default - select all i.e. row
  given: Uint8Array = new Uint8Array()
): (args: number | number[]) => number =>
  numberOfWays_UsingIndices({ ...IndicesBuilder(from, numberOfColumns, given), numberToPick });
