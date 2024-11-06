# Combinatorics

Various algorithms for enumerating / counting collections implemented in
TypeScript.

The algorithms are generic but were developed for poker hands with multiple
decks and / or missing cards. 'given' cards can be set, to be included in the
results.

## Getting Started

Instal from [jsr](https://jsr.io)

```bash
npx jsr add @elf/combinatorics
```

## Combinations

Generates a 2D array of all the combinations that may be selected (order not
important).

Example: select 2 people from the 3 options:

```ts
import { combinations } from "@elf/combinatorics/Combinations";

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

## Permutations

Generates a 2D array of all the permutations that may be selected (order
important).

Example: all the ways to select 3 people from the 3 options:

```ts
import { permutations } from "@elf/combinatorics/Permutations";

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

## Poker Hands

To calculate the number of different poker hands use numberOfWays for all the
'kinds' and numberOfConsecutive for the number of hands involving 'straights'.

### DecksBuilder

Utility function to create decks of cards.

```ts
import { decksBuilder } from "@elf/combinatorics/pokerEnumerations";

const cards = decksBuilder(); // Standard deck of cards
// Uint8Array(52) [
//    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
//   13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
//   26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
//   39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
// ]
```

Equivalent to (for 1 deck of cards):

```ts
const cards = new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52);
```

### Number of Ways

Get the total number of ways that distinct items can be selected (order not
important).

```ts
import { decksBuilder } from "@elf/combinatorics/pokerEnumerations";
import { numberOfWays } from "@elf/combinatorics/numberOfWays";

const cards = decksBuilder(); // Standard deck of cards
const select = numberOfWays(cards, 13, 5); // 13 'kinds' of cards, with 5 card hands
const fullHouses = select([3, 2]); // 3744 - Select 3 of a kind and then 2 of a kind from the remaining cards
```

The number of cards in a hand, 5 in the example above. Makes it more ergonomic
to select, for example, 3 of a kind.

```ts
const threeOfAKind = select(3);
```

Is equivalent to:

```ts
const threeOfAKind = select([3, 1, 1]);
```

As 3 of a kind has to be selected, then 1 of a kind and then another 1 of a kind
to complete the hand.

### Given cards

A hand may already contain certain cards, limiting the number of ways of making
hands.

Example: from a standard deck of cards, with the hand already containing an Ace
and King, determine the number of 4 of a kinds. I.e. so you only have 3 cards
left to draw.

```ts
// Use utility function to create the modified deck and the given cards:
const { cards, given } = decksBuilder([0, 12]); // Suited Ace and King at indices 0 and 12

// Setup with 13 different 'kinds' i.e. A, 2, 3, ..., K in 4 suits, with given cards e.g. A K (suited)
const select = numberOfWays(cards, 13, 5, given); // 13 'kinds' of cards, with 5 card hands

// Number of ways to select 4 of the same kind
const fourOfAKinds = select(4); // 2 - The only options are 3 Aces or 3 Kings

// Number of ways to select 3 of a kind and then 2 of a kind, from the remaining cards
const fullHouses = select([3, 2]); // 18 -> see calculation below
```

#### Calculation

Given A K

Select 2 Aces from 3 remaining = C(3, 2) = 3 and 1 King from 3 remaining =
C(3, 1) = 3 i.e. number of Ace high Full Houses: 3 * 3 = 9.

Similarly the number of King high Full Houses is also 9.

Therefore 18 different Full Houses can be selected, from a normal deck, given
that the hand contains AK.

### All Poker Hands

For efficiency internal 2D grids are created to represent the indices to select
'from' and those that are 'given'. These internal indices are required by both
the numberOfWays and pokerEnumerations (which uses numberOfConsecutive)
functions. So there are ..._UsingIndices alternatives to pass in this data
structure. Which is also created separately by the IndicesBuilder utility.

```ts
import {
  decksBuilder,
  pokerEnumerations,
} from "@elf/combinatorics/pokerEnumerations";
import { numberOfWays_UsingIndices } from "@elf/combinatorics/numberOfWays";
import { IndicesBuilder } from "@elf/combinatorics/IndicesBuilder";

const cards = decksBuilder(); // Standard deck of cards
const indices = IndicesBuilder(cards, 13); // 13 'kinds' of cards
const select = numberOfWays_UsingIndices({ ...indices, numberToPick: 5 });
const enumerations = pokerEnumerations(indices);

const straightFlushes = enumerations.numberOfStraightFlushes(); // 40 (including the 4 royal flushes)
const flushes = enumerations.numberOfFlushes(); // 5148 (including the 40 straightFlushes)
const straights = enumerations.numberOfStraights(); // 10240 (including the 40 straightFlushes)
const fourOfAKinds = select(4); // 624
const fullHouses = select([3, 2]); // 3744
const trips = select(3); // 54912
const twoPair = select([2, 2]); // 123552
const pairs = select(2); // 1098240
const noPairs = select(1); // 1317888 (includes straights and flushes)

// straightFlushes included in both straights and flushes, so removed twice and has to be re-added
const nothing = noPairs - straights - flushes + straightFlushes; // 1302540
```

## BitUtils

Various bit utilities, such as, population count and XOR bits. Used in Sudoku
Solver program.

Examples:

```ts
import {
  bitwiseOR,
  containingBitIndex,
  numberOfBitsSet,
  onlyOption,
} from "@elf/combinatorics/BitUtils";

numberOfBitsSet(333) === 5; // Population count i.e. 333 = 101001101 i.e. 5 bits set

const elements = [2, 6, 12]; // 0010 | 0110 | 1100 = 1110
bitwiseOR(elements) === 14; // Returns bits set within all passed elements

// Find the only set option
let xorBits = [1, 2, 3]; // 01 ^ 10 ^ 11  = 00
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
