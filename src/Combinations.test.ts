import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { combinations, combinations_ReusingIndex } from "./Combinations.ts";

describe("Combinations", () => {
  describe("C(from, pick)", () => {
    Deno.test("Select 2 people out of 3 options", () => {
      const from = [
        { name: "Tom", age: 20 },
        { name: "Dick", age: 30 },
        { name: "Harry", age: 40 }
      ];
      const pick = 2;

      const actual = combinations(from, pick);
      const expected = [
        [{ name: "Tom", age: 20 }, { name: "Dick", age: 30 }],
        [{ name: "Tom", age: 20 }, { name: "Harry", age: 40 }],
        [{ name: "Dick", age: 30 }, { name: "Harry", age: 40 }]
      ];

      expect(actual).toEqual(expected);
    });

    Deno.test("C(5, 3) = 10", () => {
      const from = [
        { name: "a" },
        { name: "b" },
        { name: "c" },
        { name: "d" },
        { name: "e" }
      ];
      const pick = 3;

      const actual = combinations(from, pick);
      const expected = [
        [{ name: "a" }, { name: "b" }, { name: "c" }],
        [{ name: "a" }, { name: "b" }, { name: "d" }],
        [{ name: "a" }, { name: "c" }, { name: "d" }],
        [{ name: "b" }, { name: "c" }, { name: "d" }],
        [{ name: "a" }, { name: "b" }, { name: "e" }],
        [{ name: "a" }, { name: "c" }, { name: "e" }],
        [{ name: "b" }, { name: "c" }, { name: "e" }],
        [{ name: "a" }, { name: "d" }, { name: "e" }],
        [{ name: "b" }, { name: "d" }, { name: "e" }],
        [{ name: "c" }, { name: "d" }, { name: "e" }],
      ];

      expect(actual).toEqual(expected);
    });
  });

  describe("combinations_ReusingIndex", () => {
    const combinations = combinations_ReusingIndex(4);
    let select = combinations(["a", "b", "c", "d"]);

    Deno.test("C(4, 1) = 4", () => {
      const pick = 1;

      const actual = select(pick);
      const expected = [
        ["a"],
        ["b"],
        ["c"],
        ["d"]
      ];

      expect(actual).toEqual(expected);
    });

    Deno.test("C(4, 2) = 6", () => {
      const pick = 2;

      const actual = select(pick);
      const expected = [
        ["a", "b"],
        ["a", "c"],
        ["b", "c"],
        ["a", "d"],
        ["b", "d"],
        ["c", "d"]
      ];

      expect(actual).toEqual(expected);
    });

    Deno.test("C(4, 3) = 4", () => {
      const pick = 3;

      const actual = select(pick);
      const expected = [
        ["a", "b", "c"],
        ["a", "b", "d"],
        ["a", "c", "d"],
        ["b", "c", "d"]
      ];

      expect(actual).toEqual(expected);
    });

    Deno.test("C(4, 4) = 1", () => {
      const pick = 4;

      const actual = select(pick);
      const expected = [
        ["a", "b", "c", "d"]
      ];

      expect(actual).toEqual(expected);
    });

    Deno.test("Reuse combinations", () => {
      const pick = 2;

      let actual = select(pick);
      let expected = [
        ["a", "b"],
        ["a", "c"],
        ["b", "c"],
        ["a", "d"],
        ["b", "d"],
        ["c", "d"]
      ];

      expect(actual).toEqual(expected);

      select = combinations(["a", "b", "c"]);

      actual = select(pick);
      expected = [
        ["a", "b"],
        ["a", "c"],
        ["b", "c"]
      ];

      expect(actual).toEqual(expected);
    });
  });
});
