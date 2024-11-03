// Organise elements to select 'from' into a 2D grid of indices by the number of 'columns' required.
// e.g. 13 (columns) 'kinds' by 4 suits in a deck of cards
export const numericalEnumerations = (from: Uint8Array, columns: number, given: Uint8Array = new Uint8Array()): {
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
