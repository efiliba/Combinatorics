export const numericalEnumerations = (from: Uint8Array, kinds: number) => {
  let columns = kinds;                                              // Number of indices to group the grids by
  let rows = from ? from[from.length - 1] / columns + 1 >> 0 : 1;   //   e.g. 4 suits * 13 kinds
  // Extra row and column for totals used in optimisations
  let fromGrid = new Array<Uint8Array>(rows + 1);                   // 2D grid of indices to select from
  let givenGrid = new Array<Uint8Array>(rows + 1);                  // Indices that must be included in results

  let pick: number;
  const numberToPick = 5;                                           // Number of items to select
  const numberToCycle = 1;                                          // Number of items to cycle e.g. J Q K A 2

  // const setup = (from: Uint8Array, kinds: number) => {            // Array of indices to select from, grouped by kinds
  //   columns = kinds;
  //   rows = from ? from[from.length - 1] / columns + 1 >> 0 : 1;

  //   fromGrid = new Array(rows + 1);                                 
  //   givenGrid = new Array(rows + 1);
  for (let index = 0; index < rows + 1; index++) {
    fromGrid[index] = new Uint8Array(columns + 1);
    givenGrid[index] = new Uint8Array(columns + 1);
  }

  from.forEach(num => {                                           // Values in fromGrid set based on indices in passed array
    fromGrid[num / columns >> 0][num % columns]++;
    fromGrid[rows][num % columns]++;
    fromGrid[num / columns >> 0][columns]++;
  });
  // };

  const setGiven = (given) => {                                       // Optionaly set indices that must be included in results
    if (given) {
      if (given[given.length - 1] / columns >> 0 >= rows) {       // Ensure enough rows created during setup
        resetGrids((given[given.length - 1] / columns >> 0) + 1);// Reset rows to passing value and adjust sizes of fromGrid and givenGrid
      }                                                           // ToDo: resetGrids not implemented

      given.forEach(num => {                                      // Set values in givenGrid relative to the passes indices
        givenGrid[num / columns >> 0][num % columns]++;
        givenGrid[rows][num % columns]++;
        givenGrid[num / columns >> 0][columns]++;
      });

      givenGrid[rows][columns] = given.length;
    }
  };

  const numberOfWays = (args) => {                                    // Select 'kinds' e.g. [3, 2] 3 of a Kind and 2 of a kind
    pick = formatPicked(args);
    return count(numberToPick - givenGrid[rows][columns], 0) / repeatedPicks();
  };

  const formatPicked = (args) => {                                    // Pad args e.g. 4 => [4, 1] i.e. pick 4 of a kind and 1 of a kind
    let picked;
    let pickIndex;
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
    }
    else {
      picked = new Uint8Array(numberToPick - args + 1);
      picked[0] = args;
      pickIndex = 1;
    }

    while (pickIndex < picked.length) {
      picked[pickIndex++] = 1;
    }

    return picked;
  };

  const count = (totalLeftToPick, pickIndex) => {                     // Main recursive function to count combinations
    if (pickIndex >= pick.length) {                                 // Ensure enough indices left to pick 
      return totalLeftToPick ? 0 : 1;                             //   'Falled off' this recursive branch -> do not include in calculations
    }

    let total = 0;
    for (let index = 0; index < columns; index++) {
      const pickAmt = pick[pickIndex] - givenGrid[rows][index];
      const fromAmt = fromGrid[rows][index];
      if (pickAmt <= totalLeftToPick && fromAmt && pickAmt >= 0) {
        fromGrid[rows][index] = null;                           // Temporarily remove indices from options, for next recursive call
        total += C(fromAmt, pickAmt) * count(totalLeftToPick - pickAmt, pickIndex + 1);
        fromGrid[rows][index] = fromAmt;
      }
    }

    return total;
  };

  const C = (n, k) => {                                               // Helper Combination C(n, k) function
    if (k > n) {
      return 0;
    }

    const largest = k > n / 2 ? k : n - k;
    let total = 1;
    for (let i = largest + 1; i <= n; i++) {
      total *= i;
    }

    return total / choose(n - largest);
  };

  const choose = (n) => n <= 1 ? 1 : n * choose(n - 1);               // Helper Choose ! function

  const repeatedPicks = () => {                                       // Count the number of combinations that are duplicate
    let total = 1;
    let repeated = 1;
    let current = 0;

    while (++current < pick.length) {
      total *= pick[current - 1] == pick[current] ? ++repeated : (repeated = 1);
    }

    return total;
  };

  const numberConsecutive = (fromArr, givenArr) => {                  // Count number of consecutive indices
    let firstGivenPos = 0;                                          // Positition of first given indice - used to constraint range checkes
    while (firstGivenPos < columns && givenArr[firstGivenPos] == 0) {
      firstGivenPos++;
    }

    let lastGivenPos = columns - 1;                                 // Position of last given indice, if any
    while (lastGivenPos >= 0 && givenGrid[rows][lastGivenPos] == 0) {
      lastGivenPos--;
    }

    let fromPos = lastGivenPos - numberToPick + 1 > 0 ? lastGivenPos - numberToPick + 1 : 0;// Range within 0 to fromArr.length + cycle - 1
    let toPos = firstGivenPos + numberToPick < columns + numberToCycle ? firstGivenPos + numberToPick - 1 : columns + numberToCycle - 1;
    let total = countConsecutive(fromArr, givenArr, fromPos, toPos);// Number of consecutive within the confined range

    while (firstGivenPos < numberToCycle) {                         // Include consecutive that wrap round, based on numberToCycle
      lastGivenPos = firstGivenPos + columns;
      let index = firstGivenPos + 1;

      while (index < columns && givenGrid[rows][index] == 0) {
        index++;
      }

      firstGivenPos = index < columns ? index : lastGivenPos;
      fromPos = lastGivenPos - numberToPick + 1 > 0 ? lastGivenPos - numberToPick + 1 : 0;
      toPos = firstGivenPos + numberToPick < columns + numberToCycle ? firstGivenPos + numberToPick - 1 : columns + numberToCycle - 1;
      total += countConsecutive(fromArr, givenArr, fromPos, toPos);
    }

    return total;
  };

  const countConsecutive = (fromArr, givenArr, fromPos, toPos) => {   // Count number of consecutive indices within the given range
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

  const suitToCheck = () => {                                         // Only check suit of any given indice
    let suitNumber = rows - 1;
    while (givenGrid[suitNumber][columns] == 0) {
      suitNumber--;
    }

    return givenGrid[suitNumber][columns] == givenGrid[rows][columns] ? suitNumber : null;
  };

  // 'Poker' specific combinations

  const numberOfStraights = () => {
    for (let index = 0; index < columns; index++) {                 // No posible straights if more than 1 given indice is of the same kind 
      if (givenGrid[rows][index] > 1) {
        return 0;
      }
    }

    return numberConsecutive(fromGrid[rows], givenGrid[rows]);
  };

  const numberOfFlushes = () => {
    let total = 0;
    if (givenGrid[rows][columns] == 0) {                            // If no given indices use normal probability theory
      for (let index = 0; index < rows; index++) {
        total += C(fromGrid[index][columns], numberToPick);
      }
    }
    else {
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
    }
    else {
      const suitNumber = suitToCheck();
      total = suitNumber == null ? 0 : numberConsecutive(fromGrid[suitNumber], givenGrid[suitNumber]);
    }

    return total;
  };

  return {
    // setup,                                                          // Array of indices to select from, grouped by kinds
    setGiven,                                                       // Indices that must be included in results
    numberOfWays,                                                   // Select 'kinds' e.g. [3, 2] 3 of a Kind and 2 of a kind
    numberOfStraights,                                              // Includes Straight Flushes and Royal Flushes
    numberOfFlushes,                                                // Includes Straight Flushes and Royal Flushes
    numberOfStraightFlushes                                         // Includes Royal Flushes
  };
};
