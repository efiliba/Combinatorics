type ConsecutiveOptions = {
  columns: number;
  rows: number;
  givenGrid: Uint8Array[];
  numberToPick?: number;
  cycle?: number;
};

// Count number of consecutive indices within the given range
const countConsecutive = (columns: number, fromArr: Uint8Array, givenArr: Uint8Array) =>
  (fromPos: number, toPos: number, numberToPick: number) => {
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
export const numberOfConsecutiveUsingIndices = ({
  columns,
  rows,
  givenGrid,
  numberToPick = rows,
  cycle = 0
}: ConsecutiveOptions) =>
  (fromArr: Uint8Array, givenArr: Uint8Array): number => {
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
    const consecutive = countConsecutive(columns, fromArr, givenArr);  // Number of consecutive within the confined range
    let total = consecutive(fromPos, toPos, numberToPick);  // Number of consecutive within the confined range

    while (firstGivenPos < cycle) {       // Include consecutive that wrap round, based on cycle
      lastGivenPos = firstGivenPos + columns;
      let index = firstGivenPos + 1;

      while (index < columns && givenGrid[rows][index] == 0) {
        index++;
      }

      firstGivenPos = index < columns ? index : lastGivenPos;
      fromPos = lastGivenPos - numberToPick + 1 > 0 ? lastGivenPos - numberToPick + 1 : 0;
      toPos = firstGivenPos + numberToPick < columns + cycle ? firstGivenPos + numberToPick - 1 : columns + cycle - 1;
      total += consecutive(fromPos, toPos, numberToPick);
    }

    return total;
  };
