// var enumerations = require('./numericalEnumerations.js');
import { numericalEnumerations } from './numericalEnumerations.ts';

const numberOfDecks = 1;
const cards = new Uint8Array(52 * numberOfDecks).map((_, index) => index % 52);   // TypedArray [0, 1, 2, ... 51] * numberOfDecks

const enumerations = numericalEnumerations(cards, 13);
// enumerations.setup(cards, 13);                                          // 13 different kinds of cards i.e. A, 2, 3, ... K

//enumerations.setGiven([0, 12]);                                       // E.g. given A K (suited)

const hands = {
  straightFlushes: enumerations.numberOfStraightFlushes(),            //      40
  flushes: enumerations.numberOfFlushes(),                            //    5148
  straights: enumerations.numberOfStraights(),                        //   10240
  fourOfAKind: enumerations.numberOfWays(4),                          //     624
  fullHouse: enumerations.numberOfWays([3, 2]),                       //    3744
  trips: enumerations.numberOfWays(3),                                //   54912
  twoPair: enumerations.numberOfWays([2, 2]),                         //  123552
  pair: enumerations.numberOfWays(2),                                 // 1098240
  noPairs: enumerations.numberOfWays(1)                               // 1317888
}

console.log('NumOfStraightFlushes: ' + hands.straightFlushes);          //      40 = Straight and Royal flushes
console.log('Flushes: ' + (hands.flushes - hands.straightFlushes));     //    5148 - 40	=  5108
console.log('Straights: ' + (hands.straights - hands.straightFlushes)); //   10240 - 40	= 10200
if (numberOfDecks > 1) {
  console.log('Five of a Kind: ' + enumerations.numberOfWays(5));     //	For 2 decks: 728
}
console.log('Four of a Kind: ' + hands.fourOfAKind);                    //     624
console.log('Full Houses: ' + hands.fullHouse);                         //    3744
console.log('Three of a Kind: ' + hands.trips);                         //   54912
console.log('Two pair: ' + hands.twoPair);                              //  123552
console.log('One pair: ' + hands.pair);                                 // 1098240
// 1317888 - 10200 - 5108 - 40 (straight flushes added, as included in both straights and flushes) = 1302540
console.log('Nothing: ' + (hands.noPairs - hands.straights - hands.flushes + hands.straightFlushes));	
