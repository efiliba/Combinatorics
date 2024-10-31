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

export const P = <T>(from: T[]): T[] | T[][] =>
  from.length === 1
    ? from
    : from.reduce((permutations, item, index) =>
      [
        ...permutations,
        ...distribute(item, P(removeItemAtIndex(from, index)))
      ], [] as T[][]);
