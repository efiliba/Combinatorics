import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { permutations } from "./Permutations.ts";

describe("Permutations", () => {
  Deno.test("All the ways to order 3 people", () => {
    const from = [
      { name: "Tom", age: 20 },
      { name: "Dick", age: 30 },
      { name: "Harry", age: 40 }
    ];

    const actual = permutations(from);
    const expected = [
      [{ name: "Tom", age: 20 }, { name: "Dick", age: 30 }, { name: "Harry", age: 40 }],
      [{ name: "Tom", age: 20 }, { name: "Harry", age: 40 }, { name: "Dick", age: 30 }],
      [{ name: "Dick", age: 30 }, { name: "Tom", age: 20 }, { name: "Harry", age: 40 }],
      [{ name: "Dick", age: 30 }, { name: "Harry", age: 40 }, { name: "Tom", age: 20 }],
      [{ name: "Harry", age: 40 }, { name: "Tom", age: 20 }, { name: "Dick", age: 30 }],
      [{ name: "Harry", age: 40 }, { name: "Dick", age: 30 }, { name: "Tom", age: 20 }]
    ];

    expect(actual).toEqual(expected);
  });

  Deno.test("P(3) = 6", () => {
    const from = [1, 2, 3];
    expect(permutations(from)).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ]);
  });
});
