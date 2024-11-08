const choose = (n: number): number => n <= 1 ? 1 : n * choose(n - 1);

/**
 * Combinations: C(n, k) = n!/[(n-k)!k!]
 * @param n The number of items to select from
 * @param k The number of items to select
 * @returns The number of ways to select k items out of n options
 */
export const C = (n: number, k: number): number => {
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
