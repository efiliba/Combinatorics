import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { IndicesBuilder } from "./IndicesBuilder.ts";
import { numberOfWays_UsingIndices } from "./numberOfWays.ts";
import { decksBuilder, pokerEnumerations } from "./pokerEnumerations.ts";

describe("pokerEnumerations", () => {
  describe("Number of poker specific hands", () => {
    const cards = decksBuilder();
    const enumerations = pokerEnumerations(IndicesBuilder(cards, 13));  // 13 'kinds' of cards

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

  describe("All poker hands", () => {
    const cards = decksBuilder();
    const indices = IndicesBuilder(cards, 13); // 13 'kinds' of cards
    const select = numberOfWays_UsingIndices({ ...indices, numberToPick: 5 });
    const enumerations = pokerEnumerations(indices);

    const hands = {
      royalFlushes: 4,
      straightFlushes: enumerations.numberOfStraightFlushes(),      //      40
      flushes: enumerations.numberOfFlushes(),                      //    5148
      straights: enumerations.numberOfStraights(),                  //   10240
      fourOfAKinds: select(4),                                      //     624
      fullHouses: select([3, 2]),                                   //    3744
      trips: select(3),                                             //   54912
      twoPair: select([2, 2]),                                      //  123552
      pairs: select(2),                                             // 1098240
      noPairs: select(1)                                            // 1317888
    };

    const actual = {
      straightFlushes: hands.straightFlushes - hands.royalFlushes,  //      36
      flushes: hands.flushes - hands.straightFlushes,               //    5108
      straights: hands.straights - hands.straightFlushes,           //   10200
      fourOfAKinds: hands.fourOfAKinds,                             //     624
      fullHouses: hands.fullHouses,                                 //    3744
      trips: hands.trips,                                           //   54912
      twoPair: hands.twoPair,                                       //  123552
      pairs: hands.pairs,                                           // 1098240
      nothing: hands.noPairs - hands.straights - hands.flushes + hands.straightFlushes  // 1302540
    };

    const expected = {
      straightFlushes: 36,
      flushes: 5108,
      straights: 10200,
      fourOfAKinds: 624,
      fullHouses: 3744,
      trips: 54912,
      twoPair: 123552,
      pairs: 1098240,
      nothing: 1302540  // 1317888 - 10240 - 5148 + 40, re-add straight flushes, included in both straights and flushes
    };

    expect(actual).toEqual(expected);
  });

  describe("Poker hands given Ace King", () => {
    const { cards } = decksBuilder([0, 12]);                        // Leave out 0 and 12 as they are 'given'
    // 13 'kinds' of cards, given A K
    const enumerations = pokerEnumerations(IndicesBuilder(cards, 13, new Uint8Array([0, 12])));

    Deno.test("numberOfStraightFlushes", () => {
      expect(enumerations.numberOfStraightFlushes()).toEqual(1);    // Only 1 with given A K
    });

    Deno.test("numberOfFlushes", () => {
      expect(enumerations.numberOfFlushes()).toEqual(165);
    });

    Deno.test("numberOfStraights", () => {
      expect(enumerations.numberOfStraights()).toEqual(64);
    });
  });

  describe("Poker hands given Ace King, with a cycle of 5", () => {
    const { cards } = decksBuilder([0, 12]);                        // Leave out 0 and 12 as they are 'given'
    const enumerations = pokerEnumerations({ ...IndicesBuilder(cards, 13, new Uint8Array([0, 12])), cycle: 5 });

    Deno.test("numberOfStraightFlushes", () => {
      // A K Q J 10
      // 2 A K Q J
      // 3 2 A K Q
      // 4 3 2 A K 
      expect(enumerations.numberOfStraightFlushes()).toEqual(4);
    });

    Deno.test("numberOfFlushes", () => {
      expect(enumerations.numberOfFlushes()).toEqual(165);          // Not effected by cycle
    });

    Deno.test("numberOfStraights", () => {
      expect(enumerations.numberOfStraights()).toEqual(256);
    });
  });

  describe("Unable to make hands due to given cards (2 Aces)", () => {
    const { cards } = decksBuilder([0, 13]);                        // Leave out 2 Aces 'given'
    // 13 'kinds' of cards, given 2 Aces
    const enumerations = pokerEnumerations(IndicesBuilder(cards, 13, new Uint8Array([0, 13])));

    Deno.test("numberOfStraightFlushes", () => {
      expect(enumerations.numberOfStraightFlushes()).toEqual(0);
    });

    Deno.test("numberOfFlushes", () => {
      expect(enumerations.numberOfFlushes()).toEqual(0);
    });

    Deno.test("numberOfStraights", () => {
      expect(enumerations.numberOfStraights()).toEqual(0);
    });
  });

  describe("Select more than available, but cards overlap, and given Ace", () => {
    const cards = new Uint8Array(5)
      .map((_, index) => index)
      .filter(card => card !== 0)                                   // Leave out 'given' Ace

    // 5 'kinds' of cards but select 6, given an Ace
    const enumerations = pokerEnumerations({ ...IndicesBuilder(cards, 5, new Uint8Array([0])), numberToPick: 6, cycle: 5 });

    Deno.test("numberOfStraightFlushes", () => {
      expect(enumerations.numberOfStraightFlushes()).toEqual(6);
    });

    Deno.test("numberOfFlushes", () => {
      expect(enumerations.numberOfFlushes()).toEqual(0);
    });

    Deno.test("numberOfStraights", () => {
      expect(enumerations.numberOfStraights()).toEqual(6);
    });
  });
});
