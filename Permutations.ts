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

export const permutations = <T>(from: T[]): T[] | T[][] =>
  from.length === 1
    ? from
    : from.reduce((items, item, index) =>
      [
        ...items,
        ...distribute(item, permutations(removeItemAtIndex(from, index)))
      ], [] as T[][]);
