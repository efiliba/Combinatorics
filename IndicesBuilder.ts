/**
 * Internal function to organise options to select 'from' into a grid of indices (for optimisations)
 * 
 * @param from An Uint8Array of indices to select 'from'
 * @example standard deck of cards
 * ```ts
 * new Uint8Array(52).map((_, index) => index)
 * ```
 * @param columns The number of 'columns' to partition the 'from' indices into
 * @example 13 'kinds' of cards
 * @param given (optional) An Uint8Array of indices that must be included in the calculations
 * @example 'given' Ace King - suited (on same row)
 * ```ts
 * new Uint8Array([0, 12]))
 * ```
 * @returns internal grids (column & row) of the indices to pick 'from' and those 'given'
 */
export const IndicesBuilder = (from: Uint8Array, columns: number, given: Uint8Array = new Uint8Array()): {
  columns: number;
  rows: number;
  fromGrid: Uint8Array[];
  givenGrid: Uint8Array[];
} => {
  const rows = from.length > 0 ? from[from.length - 1] / columns + 1 >> 0 : 1;

  // Extra row and column for totals used in optimisations
  const fromGrid = new Array<Uint8Array>(rows + 1);
  const givenGrid = new Array<Uint8Array>(rows + 1);  // Indices that must be included in results

  for (let index = 0; index < rows + 1; index++) {
    fromGrid[index] = new Uint8Array(columns + 1);
    givenGrid[index] = new Uint8Array(columns + 1);
  }

  from.forEach(num => {                               // Values in fromGrid set based on indices in passed array
    fromGrid[num / columns >> 0][num % columns]++;
    fromGrid[rows][num % columns]++;
    fromGrid[num / columns >> 0][columns]++;
  });

  // Optionaly set indices that must be included in results
  given.forEach(num => {                              // Set values in givenGrid relative to the passes indices
    givenGrid[num / columns >> 0][num % columns]++;
    givenGrid[rows][num % columns]++;
    givenGrid[num / columns >> 0][columns]++;
  });

  givenGrid[rows][columns] = given.length;

  return {
    columns,
    rows,
    fromGrid,
    givenGrid
  };
};
