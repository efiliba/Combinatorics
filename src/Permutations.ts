const distribute = <T>(head: T, rest: T[] | T[][]) =>
  rest.map((data: T | T[]) => {
    if (Array.isArray(data)) {
      return [head, ...data];
    }
    return [head, data];
  });

const removeItemAtIndex = <T>(items: T[], index: number) => {
  const remainingItems = [...items];
  remainingItems.splice(index, 1);

  return remainingItems;
};

/**
 * Generates a 2D array of all the permutations that may be selected (order important)
 * @param from An array of items to select the permutations 'from'
 * @returns A 2D array of the unique permutations
 * @example
 * ```ts
 * const from = [1, 2, 3];
 * permutations(from);
 * // [
 * //   [1, 2, 3],
 * //   [1, 3, 2],
 * //   [2, 1, 3],
 * //   [2, 3, 1],
 * //   [3, 1, 2],
 * //   [3, 2, 1]
 * // ]
 * ```
 */
export const permutations = <T>(from: T[]): T[] | T[][] =>
  from.length === 1
    ? from
    : from.reduce((items, item, index) =>
      [
        ...items,
        ...distribute(item, permutations(removeItemAtIndex(from, index)))
      ], [] as T[][]);
