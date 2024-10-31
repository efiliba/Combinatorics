import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { C, combinations } from "./Combinations.ts";

describe("Combinations", () => {
  describe("C(from, pick)", () => {
    const from = [
      { name: "a" },
      { name: "b" },
      { name: "c" },
      { name: "d" },
      { name: "e" }
    ];

    Deno.test("C(5, 2) = 10", () => {
      const pick = 2;

      const actual = C(from, pick);
      const expected = [
        [{ name: "a" }, { name: "b" }],
        [{ name: "a" }, { name: "c" }],
        [{ name: "b" }, { name: "c" }],
        [{ name: "a" }, { name: "d" }],
        [{ name: "b" }, { name: "d" }],
        [{ name: "c" }, { name: "d" }],
        [{ name: "a" }, { name: "e" }],
        [{ name: "b" }, { name: "e" }],
        [{ name: "c" }, { name: "e" }],
        [{ name: "d" }, { name: "e" }],
      ];

      expect(actual).toEqual(expected);
    });
  });

  describe("combinations", () => {
    const C = combinations(4);
    const from = ["a", "b", "c", "d"];

    Deno.test("C(4, 1) = 4", () => {
      const pick = 1;

      const actual = C(from, pick);
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

      const actual = C(from, pick);
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

      const actual = C(from, pick);
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

      const actual = C(from, pick);
      const expected = [
        ["a", "b", "c", "d"]
      ];

      expect(actual).toEqual(expected);
    });
  });
});
