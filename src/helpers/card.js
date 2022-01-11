export default class Card { // class dosent even need to be here, just fun to make card
    constructor(scene, rank, suit) {
        this.rank = rank;
        this.suit = suit;

        this.render = (x, y, type) => {
            let sprite = this.rank + "_of_"
            if (this.rank === 14 && this.suit === 1) {
                sprite = "black_joker"
            } else if (this.rank === 14 && this.suit === 2) {
                sprite = "colour_joker"
            } else if (this.suit === 1) {
                sprite += "diamonds"
            } else if (this.suit === 2) {
                sprite += "clubs"
            } else if (this.suit === 3) {
                sprite += "hearts"
            } else {
                sprite += "spades"
            }

            let card = scene.add.image(x, y, sprite);
            if (type === 1) {
                card.setScale(0.25, 0.25).setInteractive();
            } else {
                card.setScale(0.15, 0.15).disableInteractive();
            }
            card.setData({
                selected: false,
                rank: this.rank,
                suit: this.suit
            });
            return card;
        }
    }
}