import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { numberOfWays } from "./numberOfWays.ts";

describe("numberOfWays", () => {
  describe("Standard deck of cards", () => {
    const numberOfDecks = 1;
    // TypedArray [0, 1, 2, ... 51] * numberOfDecks
    const cards = new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52);

    const select = numberOfWays(cards, 13, 5);  // 13 'kinds' of cards, with 5 card hands

    Deno.test("four of a kinds", () => {
      // Select 4 of a kind and then explicitly select 1 of a kind from the remaining cards
      expect(select([4, 1])).toEqual(624);
      expect(select(4)).toEqual(624);           // auto padding to fill hand
    });

    Deno.test("full houses", () => {
      // Select 3 of a kind and then 2 of a kind from the remaining cards
      expect(select([3, 2])).toEqual(3744);
    });

    Deno.test("trips", () => {
      // Select 3 of a kind and then 1 of a kind, twice, from the remaining cards
      expect(select([3, 1, 1])).toEqual(54912);
      expect(select([3, 1])).toEqual(54912);    // auto padding array to fill hand
      expect(select(3)).toEqual(54912);         // auto pad to fill both single cards
    });

    Deno.test("two pairs", () => {
      expect(select([2, 2])).toEqual(123552);
    });

    Deno.test("pairs", () => {
      expect(select(2)).toEqual(1098240);
    });

    Deno.test("no pairs", () => {
      expect(select(1)).toEqual(1317888);
      expect(select([1, 1, 1, 1, 1])).toEqual(1317888);
    });
  });

  describe("Standard deck of cards, with hand already containing an Ace King", () => {
    const cards = new Uint8Array(52)
      .map((_, index) => index % 52)
      .filter(card => card !== 0 && card !== 12)                    // Leave out 0 and 12 as they are 'given'

    // Setup with 13 different 'kinds' i.e. A, 2, 3, ..., K in 4 suits, with given cards e.g. A K (suited)
    const select = numberOfWays(cards, 13, 5, new Uint8Array([0, 12]));                        // 13 'kinds' of cards, with 5 card hands

    Deno.test("full Houses", () => {
      // Select 2 Aces from 3 remaining = C(3, 2) = 3 and 1 King from 3 remaining = C(3, 1) = 3
      //   i.e. number of Ace high Full Houses: 3 * 3 = 9.
      // Similarly the number of King high Full Houses is also 9.
      // Therefore 18 different Full Houses can be selected, from a normal deck, given that the hand contains AK.
      expect(select([3, 2])).toEqual(18);
    });

    Deno.test("four of a kind", () => {
      expect(select(4)).toEqual(2); // Only options for remaining cards are 3 Aces or 3 Kings
    });
  });
});
