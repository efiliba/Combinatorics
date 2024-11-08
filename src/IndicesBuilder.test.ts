import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { IndicesBuilder } from "./IndicesBuilder.ts";

describe("IndicesBuilder", () => {
  describe("2 dice", () => {
    // 0  1  2  4  5  6
    // 7  8  9 10 11 12
    const dice = new Uint8Array(12).map((_, index) => index);

    Deno.test("internal grids created for 2 dice", () => {
      const actual = IndicesBuilder(dice, 6);
      const expected = {
        columns: 6,
        rows: 2,
        fromGrid: [
          new Uint8Array([1, 1, 1, 1, 1, 1, 6]),
          new Uint8Array([1, 1, 1, 1, 1, 1, 6]),
          new Uint8Array([2, 2, 2, 2, 2, 2, 0])
        ],
        givenGrid: [
          new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
          new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
          new Uint8Array([0, 0, 0, 0, 0, 0, 0])
        ]
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("2 dice, given a 1", () => {
    // 0  1  2  4  5  6
    // 7  8  9 10 11 12
    const dice = new Uint8Array(12).map((_, index) => index);

    Deno.test("internal grids created for 2 dice", () => {
      const actual = IndicesBuilder(dice, 6, new Uint8Array([0]));
      const expected = {
        columns: 6,
        rows: 2,
        fromGrid: [
          new Uint8Array([1, 1, 1, 1, 1, 1, 6]),
          new Uint8Array([1, 1, 1, 1, 1, 1, 6]),
          new Uint8Array([2, 2, 2, 2, 2, 2, 0])
        ],
        givenGrid: [
          new Uint8Array([1, 0, 0, 0, 0, 0, 1]),
          new Uint8Array([0, 0, 0, 0, 0, 0, 0]),
          new Uint8Array([1, 0, 0, 0, 0, 0, 1])
        ]
      };

      expect(actual).toEqual(expected);
    });
  });

  Deno.test("select from no options", () => {
    const actual = IndicesBuilder(new Uint8Array(), 2);

    const expected = {
      columns: 2,
      rows: 1,
      fromGrid: [
        new Uint8Array([0, 0, 0]),
        new Uint8Array([0, 0, 0])
      ],
      givenGrid: [
        new Uint8Array([0, 0, 0]),
        new Uint8Array([0, 0, 0])
      ]
    };
    expect(actual).toEqual(expected);
  });
});
