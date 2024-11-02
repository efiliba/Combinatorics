const choose = (n: number): number => n <= 1 ? 1 : n * choose(n - 1);

export const C = (n: number, k: number) => {
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
