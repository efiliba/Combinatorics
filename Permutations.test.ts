import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { P } from "./Permutations.ts";

describe("Permutations", () => {
  Deno.test("P(3) = 6", () => {
    const from = [1, 2, 3];
    const permutations = P(from);

    expect(permutations).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ]);
  });
});
