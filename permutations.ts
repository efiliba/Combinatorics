const distribute = <T>(head: T, rest: T[] | T[][]) => rest.map((data: T | T[]) => {
  if (Array.isArray(data)) {
    return [head,  ...data];
  }
  return [head, data];
});

const removeItemAtIndex = <T>(items: T[], index: number) => {
  const remainingItems = [...items];
  remainingItems.splice(index, 1);

  return remainingItems;
};

const enumeratePermutations = <T extends string | number>(items: T[]) =>
  items.length === 1
    ? items
    : items.reduce((permutations, item, index) =>
      [...permutations, ...distribute(item, enumeratePermutations(removeItemAtIndex(items, index)))]
    , [] as T[] | T[][]);

const mapItemValues = <T extends string | number>(items: T[]) =>
  [...new Set(items)].reduce((uniqueItemValues, item, index) => ({
    ...uniqueItemValues,
    [item]: index
  }), {} as Record<T, number>);

const mapPowers = (n: number) => {
  const powers = [1];
  for (let index = 1, power = n; index < n; index++) {
    powers.push(power);
    power *= n;
  }

  return powers;
};

const hashFn =  <T extends string | number>(itemValueLookup: Record<T, number>, powers: number[]) =>
  (items: T[]) =>
    items.reduce((value, item, column) =>
      value + itemValueLookup[item] * powers[column]
    , 0);

const deDuplicate = <T extends string | number>(items: T[]) => (permutations: T[][]) => {
  const hash = hashFn<T>(mapItemValues(items), mapPowers(items.length));
  const hashes: boolean[] = [];

  return permutations.filter(permutation => {
    const hashValue = hash(permutation);
    if (hashes[hashValue]) {
      return false;
    }
    hashes[hashValue] = true;
    return true;
  });
};
