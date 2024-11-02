import { C } from "./Utils.ts";

type PokerEnumerations = {
  columns: number;                        // Number of indices to group the grids by i.e. 13 'kinds' in a deck of cards
  rows: number;
  fromGrid: Uint8Array[];
  givenGrid: Uint8Array[];
  numberToPick: number;                   // Number of items to select e.g. 5 for a hand of cards
  cycle?: number;                         // Number of items to cycle e.g. J Q K A 2
};

export const pokerEnumerations = ({ columns, rows, fromGrid, givenGrid, numberToPick, cycle = 1 }: PokerEnumerations) => {
  // Count number of consecutive indices within the given range
  const countConsecutive = (fromArr: Uint8Array, givenArr: Uint8Array, fromPos: number, toPos: number) => {
    let total = 0;
    while (fromPos <= toPos - numberToPick + 1) {
      let subTotal = 1;
      for (let index = fromPos; index < fromPos + numberToPick; index++) {
        subTotal *= givenArr[index % columns] ? givenArr[index % columns] : fromArr[index % columns];
      }

      fromPos++;
      total += subTotal;
    }

    return total;
  };

  // Count number of consecutive indices
  const numberConsecutive = (fromArr: Uint8Array, givenArr: Uint8Array) => {
    let firstGivenPos = 0;                // Positition of first given indice - used to constraint range checkes
    while (firstGivenPos < columns && givenArr[firstGivenPos] == 0) {
      firstGivenPos++;
    }

    let lastGivenPos = columns - 1;       // Position of last given indice, if any
    while (lastGivenPos >= 0 && givenGrid[rows][lastGivenPos] == 0) {
      lastGivenPos--;
    }

    // Range within 0 to fromArr.length + cycle - 1
    let fromPos = lastGivenPos - numberToPick + 1 > 0 ? lastGivenPos - numberToPick + 1 : 0;
    let toPos = firstGivenPos + numberToPick < columns + cycle ? firstGivenPos + numberToPick - 1 : columns + cycle - 1;
    let total = countConsecutive(fromArr, givenArr, fromPos, toPos);  // Number of consecutive within the confined range

    while (firstGivenPos < cycle) {       // Include consecutive that wrap round, based on cycle
      lastGivenPos = firstGivenPos + columns;
      let index = firstGivenPos + 1;

      while (index < columns && givenGrid[rows][index] == 0) {
        index++;
      }

      firstGivenPos = index < columns ? index : lastGivenPos;
      fromPos = lastGivenPos - numberToPick + 1 > 0 ? lastGivenPos - numberToPick + 1 : 0;
      toPos = firstGivenPos + numberToPick < columns + cycle ? firstGivenPos + numberToPick - 1 : columns + cycle - 1;
      total += countConsecutive(fromArr, givenArr, fromPos, toPos);
    }

    return total;
  };

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

    return numberConsecutive(fromGrid[rows], givenGrid[rows]);
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
        total += numberConsecutive(fromGrid[index], givenGrid[index]);
      }
    } else {
      const suitNumber = suitToCheck();
      total = suitNumber == null ? 0 : numberConsecutive(fromGrid[suitNumber], givenGrid[suitNumber]);
    }

    return total;
  };

  return {
    numberOfStraights,                    // Includes Straight Flushes and Royal Flushes
    numberOfFlushes,                      // Includes Straight Flushes and Royal Flushes
    numberOfStraightFlushes               // Includes Royal Flushes
  };
};
