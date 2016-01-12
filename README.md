# Combinatorics
Various algorithms for enumerating / counting collections implemented in TypeScript / JavaScript

## numericalEnumerations.js
Algorithms I created in 2001 in C# to calculate Poker odds. Now ported to JavaScript in Node.js

The included pokerProbabilities.js shows how to use the above file to calculate the number of different poker hands.

The algorithms are generic and were tested on poker hands with multiple decks and with missing cards. You can also set 'given' cards.

For example, you can determine the number of 4 of a kinds, starting with Ace and King, so you only have 3 cards left to draw.

```javascript
var enumerations = require('./numericalEnumerations.js');
// Normal deck of 52 cards. Duplicate values to add multiples of specific cards and/or leave out unwanted cards
var cards = [0, 1, ..., 51];
cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, ..., 51]; // 0 and 12 left out of deck as they will be 'given'
enumerations.setup(cards, 13);                                // Setup with 13 different 'kinds' i.e. A, 2, 3, ..., K in 4 suits
enumerations.setGiven([0, 12]);                               // Set given cards e.g. A K (suited)
enumerations.numberOfWays(4) === 2;                           // Number of ways to select 4 of the same kind i.e. Aces or Kings
enumerations.numberOfWays([3, 2]) === 18;                     // Number of Full Houses (verify calculation below)
```
### Calculation 
Given A K

Select 2 Aces from 3 remaining = C(3, 2) = 3 and 1 King from 3 remaining = C(3, 1) = 3 i.e. number of Ace high Full Houses: 3 * 3 = 9.

Similarly the number of King high Full Houses is also 9.

Therefore 18 different Full Houses can be selected, from a normal deck, given that the hand contains AK.
***
## Combinations.ts
Creates a 2D array of all the combinations that may be selected.

The unit test example below shows all the combinations of 3 items selected from 4 choices

```TypeScript
private combinations: ICombinations<string> = new Solver.Combinations(4);

// C(4, 3) = 4
private C_4_3(): boolean {
    var from = ["a", "b", "c", "d"];
    var pick = 3;

    var expected: string[][] = [];
    expected[0] = ["a", "b", "c"];
    expected[1] = ["a", "b", "d"];
    expected[2] = ["a", "c", "d"];
    expected[3] = ["b", "c", "d"];

    var items: string[][] = this.combinations.select(from, pick);

    var match: boolean = this.compare(items, expected);

    return match;
}
```

## BitUtilities.ts
Various bit utilities, such as, population count and XOR bits

Examples:
```TypeScript
Solver.BitUtilities.numberOfBitsSet(333) === 5;                   // Population count i.e. 333 = 101001101 i.e. 5 bits set

var elements = [2, 6, 12];                                        // 0010 | 0110 | 1100 = 1110
Solver.BitUtilities.bitwiseOR(elements) === 14;                   // Returns bits set within all passed elements

// Find the only set option
var xorBits: number[] = [1, 2, 3];                                // 01 ^ 10 ^ 11  = 00 
Solver.BitUtilities.onlyOption(xorBits).found === false;          // No bits set

xorBits = [1, 2, 4, 8];                                           // 0001 ^ 0010 ^ 0100 ^ 1000 = 1111
Solver.BitUtilities.onlyOption(xorBits).found === false;          // All bits set i.e. singulare bit required

xorBits = [5, 6, 9, 12];                                          // 0101 ^ 0110 ^ 1001 ^ 1100 = 0010
var options: IOnlyOptionResult = Solver.BitUtilities.onlyOption(xorBits);
options.found === true;                                           // Only option found and at bit 2
options.bit === 2;                                

// Index of first item in array containing a specified bit
var array: number[] = [0, 2, 3, 4];                               // 000, 010, 011, 100
Solver.BitUtilities.containingBitIndex(array, 1) === 2;           // Only item 3 has bit 1 set, which is at index 2 of the array
Solver.BitUtilities.containingBitIndex(array, 2) === 1;           // Item 2 is the first item that has bit 2 set, i.e. index = 1
Solver.BitUtilities.containingBitIndex(array, 8) === array.length;// Bit 8 not set => index out of range
Solver.BitUtilities.containingBitIndex(array, 0) === array.length;// Bit 0 not found => index out of range
```
