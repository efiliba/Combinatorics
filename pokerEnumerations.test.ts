import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { pokerEnumerations } from "./pokerEnumerations.ts";

describe("pokerEnumerations", () => {
  const numberOfDecks = 1;
  // TypedArray [0, 1, 2, ... 51] * numberOfDecks
  const cards = new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52);

  const enumerations = pokerEnumerations(cards, 13, 5);         // 13 'kinds' of cards

  Deno.test("numberOfStraightFlushes", () => {
    expect(enumerations.numberOfStraightFlushes()).toEqual(40); // 36 + 4 (royal flushes)
  });

  Deno.test("numberOfFlushes", () => {
    expect(enumerations.numberOfFlushes()).toEqual(5148);       // 5108 + 40 (straight flushes)
  });

  Deno.test("numberOfStraights", () => {
    expect(enumerations.numberOfStraights()).toEqual(10240);    // 10200 + 40 (straight flushes)
  });
});
