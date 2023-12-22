## Landlord

Online Multiplayer Card Game

The game functional but still in an incomplete state. Many features and improvements are planned and will be added in the future.

## Running the game

To run locally, start the [backend](https://github.com/Snypintyme/landlord-backend) and run:

```
npm start
```

The game requires 3 players, and opening 3 separate tabs will work

## Gameplay

This game is a version of a popular Chinese card game. This version supports 3 players. Each round, one player is the 'landlord' and the other two players team up as the 'peasants'. The objective is to play out all of your cards in valid combinations. If the landlord plays out all their cards, the landlord wins, or if any one of the peasants plays out all their cards, the peasants win. Your team will be shown in the top left corner.

### Players, Cards and Deal

The game uses a 54-card deck including 2 jokers. Suits are irrelevant and the cards rank as follows (high to low):
<b>Red joker, Black joker, 2, A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3.</b>
At the start of each game, the landlord is randomly selected, receives three extra cards, and will start the game. The player whose turn it is will be indicated in red.

### Rules

Players take turns discarding cards in legal combinations. The landlord goes first. Each turn, the player can either pass (play no card) or beat the previous play by playing a higher combination of the <b>same number of cards</b> and the <b>same type</b>. The two exceptions are bombs and nukes which may be played on any lower combination as described below. If player A plays a combination and all other players pass, player A gets to start again with any combination. The game ends when one person discards all their cards - either the landlord or the peasants win.

<b>Valid combinations:</b>

1. <b>Single card</b>
1. <b>Pair</b> - 2 cards of the same rank
1. <b>Straight</b> - at least 5 cards of consecutive rank, from 3 up to A. 2s and Jokers cannot be used.
1. <b>Rolling Bucket</b> - at least 3 pairs of consecutive ranks, from 3 up to A. 2s and Jokers cannot be used. For example 10-10-J-J-Q-Q-K-K.
1. <b>Single Passenger Airplane</b> - one or more triplets of consecutive rank. An extra single card is added for each triplet. The attached cards must be different from all the triplets and from each other. The attached cards don't have to be in sequence. For example 7-7-7-8-8-8-3-6.
1. <b>Double Passenger Airplane</b> - same as the previous combination but with attached pairs. For example 8-8-8-9-9-9-4-4-J-J.
1. <b>Bomb</b> - 4 cards of the same rank. A bomb can beat everything except a nuke and higher ranked bombs beat lower ranked ones. For example J-J-J-J beats 7-7-7-7.
1. <b>Nuke</b> - a pair of jokers. It's the highest combination and beats everything else.

<b>Important Notes:</b>

1. Even if you play a higher combination of the same type, it needs to have the same number of cards. For example, the staight 7-8-9-10-J-Q can not be played on the straight 3-4-5-6-7 since it does not have the same number of cards. Bombs and Nukes are the exception to this rule.
1. To beat a combination, you need to play a strictly higher value hand. For example, you cannot play a single 3 on another single 3, but a single 4 will beat it.
1. The value of a combination is based on the highest card played as part of the hand. The value of both airplanes are determined by the highest triplet, passengers are not counted.
