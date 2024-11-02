import { describe } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import { C } from "./Utils.ts";

describe("Utils", () => {
  Deno.test("C(4, 3)", () => {
    expect(C(4, 3)).toBe(4);  // 4!/[(4 - 3)!*3!] = 4
  });

  Deno.test("C(3, 4), k > n", () => {
    expect(C(3, 4)).toBe(0);
  });

  Deno.test("C(0, 0)", () => {
    expect(C(0, 0)).toBe(1);
  });
});
