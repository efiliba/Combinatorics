import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { numberOfBitsSet, bitwiseOR, onlyOption, containingBitIndex } from "./BitUtils.ts";

describe("BitUtils", () => {
  Deno.test("counts the number of bits set", () => {
    // Population count i.e. 333 = 101001101 i.e. 5 bits set
    expect(numberOfBitsSet(333)).toBe(5);
  });

  describe("Set bits", () => {
    Deno.test("should have all bits set", () => {
      const elements = [1, 2, 4, 8];        // 0001 | 0010 | 0100 | 1000 = 1111
      expect(bitwiseOR(elements)).toBe(15); // Find bits set within all passed elements
    });

    Deno.test("should have duplicate bits set only once", () => {
      const elements = [1, 2, 3];           // 01 | 10 | 11  = 11
      expect(bitwiseOR(elements)).toBe(3);
    });

    Deno.test("should only have bits set if any item contains that bit", () => {
      const elements = [2, 6, 12];          // 0010 | 0110 | 1100 = 1110
      expect(bitwiseOR(elements)).toBe(14);
    });
  });

  describe("Only set option", () => {
    Deno.test("should not have any bits set", () => {
      const xorBits = [1, 2, 3];            // 01 ^ 10 ^ 11  = 00 
      expect(onlyOption(xorBits).found).toBeFalsy();
    });

    Deno.test("should have all bits set", () => {
      const xorBits = [1, 2, 4, 8];         // 0001 ^ 0010 ^ 0100 ^ 1000 = 1111
      expect(onlyOption(xorBits).found).toBeFalsy();  // All bits set i.e. singulare bit required
    });

    Deno.test("should have option found at bit 2", () => {
      const xorBits = [5, 6, 9, 12];        // 0101 ^ 0110 ^ 1001 ^ 1100 = 0010
      const options = onlyOption(xorBits);
      expect(options.found).toBeTruthy();
      expect(options.bit).toBe(2);
    });

    Deno.test("should not have a singular option set", () => {
      const xorBits = [3, 6, 12];           // 0011 ^ 0110 ^ 1100 = 1001
      const options = onlyOption(xorBits);
      expect(options.found).toBeFalsy();
    });

    Deno.test("should only have bit 8 set", () => {
      const xorBits = [3, 7, 12];           // 0011 ^ 0111 ^ 1100 = 1000
      const options = onlyOption(xorBits);
      expect(options.found).toBeTruthy();
      expect(options.bit).toBe(8);
    });
  });

  describe("First index of item in array containing bit", () => {
    const array = [0, 2, 3, 4];           // 000, 010, 011, 100

    Deno.test("should have bit 1 set i.e. index 2", () => {
      // Index of first item that has bit 1 set i.e. 2
      expect(containingBitIndex(array, 1)).toBe(2);
    });

    Deno.test("should have bit 2 set i.e. index 2", () => {
      // Index of first item that has bit 2 set i.e. 2
      expect(containingBitIndex(array, 2)).toBe(1);
    });

    Deno.test("should have bit 4 set i.e. index 3", () => {
      // Index of first item that has bit 4 set i.e. 3
      expect(containingBitIndex(array, 4)).toBe(3);
    });

    Deno.test("should have index out of range", () => {
      // Bit 8 not set => index out of range
      expect(containingBitIndex(array, 8)).toBe(array.length);
    });

    Deno.test("should not have bit 0 found (out of range)", () => {
      // Bit 0 not found => index out of range
      expect(containingBitIndex(array, 0)).toBe(array.length);
    });
  });
});
