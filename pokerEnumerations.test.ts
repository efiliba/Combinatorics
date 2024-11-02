import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { numericalEnumerations } from "./numericalEnumerations.ts";
import { pokerEnumerations } from "./pokerEnumerations.ts";
import { numberOfWays } from "./numberOfWays.ts";

describe("pokerEnumerations", () => {
  describe("Number of poker specific hands", () => {
    const numberOfDecks = 1;
    // TypedArray [0, 1, 2, ... 51] * numberOfDecks
    const cards = new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52);

    const enumerations = pokerEnumerations({
      ...numericalEnumerations(cards, 13),                        // 13 'kinds' of cards
      numberToPick: 5
    });

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
    const cards = new Uint8Array(52).map((_, index) => index % 52);

    const { select, ...rest } = numberOfWays(cards, 13, 5); // 13 'kinds' of cards, with 5 card hands
    const enumerations = pokerEnumerations(rest);

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

    const expected = {
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

    expect(actual).toEqual(expected);
  });

  describe("Poker hands given Ace King", () => {
    const cards = new Uint8Array(52)
      .map((_, index) => index)
      .filter(card => card !== 0 && card !== 12)                    // Leave out 0 and 12 as they are 'given'

    const enumerations = pokerEnumerations({
      ...numericalEnumerations(cards, 13, new Uint8Array([0, 12])), // 13 'kinds' of cards, given A K                      
      numberToPick: 5
    });

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
    const cards = new Uint8Array(52)
      .map((_, index) => index)
      .filter(card => card !== 0 && card !== 12)                    // Leave out 0 and 12 as they are 'given'

    const enumerations = pokerEnumerations({
      ...numericalEnumerations(cards, 13, new Uint8Array([0, 12])), // 13 'kinds' of cards, given A K                      
      numberToPick: 5,
      cycle: 5
    });

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
    const cards = new Uint8Array(52)
      .map((_, index) => index)
      .filter(card => card !== 0 && card !== 13)                    // Leave out 2 Aces 'given'

    const enumerations = pokerEnumerations({
      ...numericalEnumerations(cards, 13, new Uint8Array([0, 13])), // 13 'kinds' of cards, given 2 Aces                      
      numberToPick: 5
    });

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
      .filter(card => card !== 0)                                   // Leave out Ace 'given'

    const enumerations = pokerEnumerations({
      ...numericalEnumerations(cards, 5, new Uint8Array([0])),      // 5 'kinds' of cards, given an Ace                      
      numberToPick: 6,
      cycle: 5
    });

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
