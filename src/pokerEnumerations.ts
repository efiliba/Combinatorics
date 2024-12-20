import { C } from "./Utils.ts";
import { numberOfConsecutive_UsingIndices } from "./numberOfConsecutive.ts";

type PokerEnumerations = {
  columns: number;                        // Number of indices to group the grids by i.e. 13 'kinds' in a deck of cards
  rows: number;
  fromGrid: Uint8Array[];                 // 2D grid of options to select from
  givenGrid: Uint8Array[];                // 2D grid of indices that must be included in results
  numberToPick?: number;                  // Number of items to select e.g. 5 for a hand of cards
  cycle?: number;                         // Number of items to cycle e.g. J Q K A 2
};

function isGiven(givenOrNumberOfDecks: number | number[]): givenOrNumberOfDecks is number[] {
  return typeof givenOrNumberOfDecks === "object";
}

/**
 * Utility function to create decks of cards with 'given' cards
 * @param given An array of items that must be excluded from the decks
 * @param numberOfDecks Optional number of decks to created
 * @returns An object of the Uint8Array of indices representing the cards and the 'given'
 */
export function decksBuilder(given: number[], numberOfDecks?: number): {
  cards: Uint8Array;
  given: Uint8Array;
};

/**
 * Utility function to create standard decks of cards 
 * @param numberOfDecks Optional number of decks to created
 * @returns An Uint8Array of indices representing standard decks of cards
 */
export function decksBuilder(numberOfDecks?: number): Uint8Array;

export function decksBuilder(givenOrNumberOfDecks: number | number[] = 1, numberOfDecks = 1): {
  cards: Uint8Array;
  given: Uint8Array;
} | Uint8Array {
  if (isGiven(givenOrNumberOfDecks)) {
    const exclude = new Uint8Array(givenOrNumberOfDecks);

    return {
      cards: new Uint8Array(52 * numberOfDecks)
        .map((_, index) => index % 52)
        .filter(card => !exclude.includes(card)),
      given: exclude
    };
  }

  return new Uint8Array(52 * givenOrNumberOfDecks).map((_, index) => index % 52);
};

export const pokerEnumerations = ({
  columns,
  rows,
  fromGrid,
  givenGrid,
  numberToPick = 5,
  cycle = 1
}: PokerEnumerations): {
  numberOfStraights: () => number;
  numberOfFlushes: () => number;
  numberOfStraightFlushes: () => number;
} => {
  const numberOfConsecutive = numberOfConsecutive_UsingIndices({ columns, rows, givenGrid, numberToPick, cycle });

  const suitToCheck = () => {             // Only check suit of any given indice
    let suitNumber = rows - 1;
    while (givenGrid[suitNumber][columns] == 0) {
      suitNumber--;
    }

    return givenGrid[suitNumber][columns] == givenGrid[rows][columns] ? suitNumber : null;
  };

  const numberOfStraights = () => {
    for (let index = 0; index < columns; index++) {
      if (givenGrid[rows][index] > 1) {   // No posible straights if more than 1 given indice is of the same kind
        return 0;
      }
    }

    return numberOfConsecutive(fromGrid[rows], givenGrid[rows]);
  };

  const numberOfFlushes = () => {
    let total = 0;
    if (givenGrid[rows][columns] == 0) {  // If no given indices use normal probability theory
      for (let index = 0; index < rows; index++) {
        total += C(fromGrid[index][columns], numberToPick);
      }
    } else {
      const suitNumber = suitToCheck();
      total = suitNumber == null ? 0 : C(fromGrid[suitNumber][columns], numberToPick - givenGrid[rows][columns]);
    }

    return total;
  };

  const numberOfStraightFlushes = () => {
    let total = 0;
    if (givenGrid[rows][columns] == 0) {
      for (let index = 0; index < rows; index++) {
        total += numberOfConsecutive(fromGrid[index], givenGrid[index]);
      }
    } else {
      const suitNumber = suitToCheck();
      total = suitNumber == null ? 0 : numberOfConsecutive(fromGrid[suitNumber], givenGrid[suitNumber]);
    }

    return total;
  };

  return {
    numberOfStraights,                    // Includes Straight Flushes and Royal Flushes
    numberOfFlushes,                      // Includes Straight Flushes and Royal Flushes
    numberOfStraightFlushes               // Includes Royal Flushes
  };
};
