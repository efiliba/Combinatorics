# Combinatorics

Various algorithms for enumerating / counting collections implemented in
TypeScript.

The algorithms are generic but were developed for poker hands with multiple
decks and with missing cards. You can also set 'given' cards.

## Combinations.ts

Generates a 2D array of all the combinations that may be selected (order not
important).

Example: select 2 people from the 3 options:

```ts
import { combinations } from "Combinations";

const from = [
  { name: "Tom", age: 20 },
  { name: "Dick", age: 30 },
  { name: "Harry", age: 40 },
];
const pick = 2;
const options = combinations(from, pick);
// [
//   [{ name: "Tom", age: 20 }, { name: "Dick", age: 30 }],
//   [{ name: "Tom", age: 20 }, { name: "Harry", age: 40 }],
//   [{ name: "Dick", age: 30 }, { name: "Harry", age: 40 }],
// ];
```

## Permutations.ts

Generates a 2D array of all the permutations that may be selected (order
important).

Example: all the ways to select 3 people from the 3 options:

```ts
import { permutations } from "Permutations";

const from = [
  { name: "Tom", age: 20 },
  { name: "Dick", age: 30 },
  { name: "Harry", age: 40 },
];
const options = permutations(from);
// [
//   [{ name: "Tom", age: 20 }, { name: "Dick", age: 30 }, { name: "Harry", age: 40 }],
//   [{ name: "Tom", age: 20 }, { name: "Harry", age: 40 }, { name: "Dick", age: 30 }],
//   [{ name: "Dick", age: 30 }, { name: "Tom", age: 20 }, { name: "Harry", age: 40 }],
//   [{ name: "Dick", age: 30 }, { name: "Harry", age: 40 }, { name: "Tom", age: 20 }],
//   [{ name: "Harry", age: 40 }, { name: "Tom", age: 20 }, { name: "Dick", age: 30 }],
//   [{ name: "Harry", age: 40 }, { name: "Dick", age: 30 }, { name: "Tom", age: 20 }]
// ]
```

## numberOfWays.ts

Get the total number of ways that distinct items can be selected (order not
important).

Example: from a standard deck of cards, with the hand already containing an Ace
and King, determine the number of 4 of a kinds. I.e. so you only have 3 cards
left to draw.

```ts
import { numberOfWays } from "@elf/combinatorics";

const given = new Uint8Array([0, 12]); // Suited Ace and King at indices 0 and 12

// Normal deck of 52 cards, less the suited Ace and King at indices 0 and 12.
// Duplicate values to add multiples of specific cards and/or leave out unwanted cards.
const numberOfDecks = 1;
const cards = new Uint8Array(52 * numberOfDecks)
  .map((_, index) => index % 52)
  .filter((card) => !given.includes(card)); // Leave out 0 and 12 as they are 'given'

// Setup with 13 different 'kinds' i.e. A, 2, 3, ..., K in 4 suits.
// 5 card hands with the 'given' suited A K.
const { select } = NumericalEnumerations(cards, 13, 5, given);

const total4ofAKinds = select(4); // Number of ways to select 4 of the same kind
console.log(total4ofAKinds); // 2 -> The only options are 3 Aces or 3 Kings

// Number of ways to select 3 of a kind and then 2 of a kind, from the remaining cards
const totalFullHouses = select([3, 2]);
console.log(totalFullHouses); // 18 -> see calculation below
```

### Calculation

Given A K

Select 2 Aces from 3 remaining = C(3, 2) = 3 and 1 King from 3 remaining =
C(3, 1) = 3 i.e. number of Ace high Full Houses: 3 * 3 = 9.

Similarly the number of King high Full Houses is also 9.

Therefore 18 different Full Houses can be selected, from a normal deck, given
that the hand contains AK.

## BitUtils.ts

Various bit utilities, such as, population count and XOR bits

Examples:

```ts
import {
  bitwiseOR,
  containingBitIndex,
  numberOfBitsSet,
  onlyOption,
} from "./BitUtils.ts";

numberOfBitsSet(333) === 5; // Population count i.e. 333 = 101001101 i.e. 5 bits set

const elements = [2, 6, 12]; // 0010 | 0110 | 1100 = 1110
bitwiseOR(elements) === 14; // Returns bits set within all passed elements

// Find the only set option
const xorBits = [1, 2, 3]; // 01 ^ 10 ^ 11  = 00
onlyOption(xorBits).found === false; // No bits set

xorBits = [1, 2, 4, 8]; // 0001 ^ 0010 ^ 0100 ^ 1000 = 1111
onlyOption(xorBits).found === false; // All bits set i.e. singulare bit required

xorBits = [5, 6, 9, 12]; // 0101 ^ 0110 ^ 1001 ^ 1100 = 0010
const options = onlyOption(xorBits);
options.found === true; // Only option found and at bit 2
options.bit === 2;

// Index of first item in array containing a specified bit
const array = [0, 2, 3, 4]; // 000, 010, 011, 100
containingBitIndex(array, 1) === 2; // Only item 3 has bit 1 set, which is at index 2 of the array
containingBitIndex(array, 2) === 1; // Item 2 is the first item that has bit 2 set, i.e. index = 1
containingBitIndex(array, 8) === array.length; // Bit 8 not set => index out of range
containingBitIndex(array, 0) === array.length; // Bit 0 not found => index out of range
```
