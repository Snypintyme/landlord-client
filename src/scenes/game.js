import io from "socket.io-client";
import Card from "../helpers/card.js"

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        });
    }

    preload() {
        //this.scale.displaySize.setAspectRatio( 16/9 );
        //this.scale.refresh();

        for (let i = 1; i <= 13; ++i) {
            this.load.image(i + "_of_diamonds", "../assets/cards/" + i + "_of_diamonds.png");
            this.load.image(i + "_of_clubs", "../assets/cards/" + i + "_of_clubs.png");
            this.load.image(i + "_of_hearts", "../assets/cards/" + i + "_of_hearts.png");
            this.load.image(i + "_of_spades", "src/assets/cards/" + i + "_of_spades.png");
        }
        this.load.image("black_joker", "../assets/cards/black_joker.png");
        this.load.image("colour_joker", "src/assets/cards/colour_joker.png");
        this.load.image("back", "https://landlordclient.herokuapp.com/assets/cards/back.png");
    }

    create() {
        //this.gameStarted = false;
        this.playerNum;
        this.hand = [];
        //this.handSize = 0;
        this.selectedCards = [];
        this.gameData = {
            gameStart: false,
            turn: 0,
            lastHand: []
        }

        this.socket = io("https://landlordserver.herokuapp.com/");
        this.socket.on(('connect'), () => {
            console.log("Connected to server");
        })
        this.socket.on("youJoined", (num) => {
            this.playerNum = num;
        })
        this.socket.on("playerLeft", (playerIndex) => {
            if (this.playerNum > playerIndex) --this.playerNum;
        })

        this.socket.on("gameStart", (data) => {
            this.waitingText.destroy();
            this.gameData.gameStart = true;

            this.gameData.turn = data.landlord;
            let sortedCards = data.hand.sort((first, second) => {
                if (first.rank === second.rank) {
                    return first.suit - second.suit;
                } else if (((first.rank === 1 || first.rank === 2) && second.rank > 2 && second.rank !== 14) || first.rank === 14) {
                    return 1
                } else if (((second.rank === 1 || second.rank === 2) && first.rank > 2 && first.rank !== 14) || second.rank === 14) {
                    return -1
                }
                return first.rank - second.rank;
            })

            for (let i = 0; i < sortedCards.length; ++i) {
                let card = new Card(this, sortedCards[i].rank, sortedCards[i].suit);
                this.hand.push(card.render(250 + (i * 50), 700, 1));
            }

            this.playButton = this.add.text(1350, 650, "Play Cards").setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").setInteractive();
            this.passButton = this.add.text(1350, 710, "Pass Turn").setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").setInteractive();

            this.teamText = this.add.text(50, 20, (data.landlord === this.playerNum) ? "You are the Landlord" : "You are a Peasant").setFontSize(24).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.landlordCardText = this.add.text(80, 60, "Landlord Card").setFontSize(18).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.landlordCardDesc = this.add.text(70, 210, "Landlord is Player " + this.gameData.turn).setFontSize(18).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.landlordCard = new Card(this, data.landlordCard.rank,  data.landlordCard.suit);
            this.landlordCard.render(135, 145, 2)

            this.nametag = this.add.text(700, 830, "Player " + this.playerNum).setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.opponent1_nametag = this.add.text(620, 50, "Player " + ((this.playerNum % 3) + 1)).setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.oppoenent1_card = this.add.image(670, 170, "back").setScale(0.2, 0.2);
            this.opponent2_nametag = this.add.text(1200, 50, "Player " + (((this.playerNum + 1) % 3) + 1)).setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.oppoenent2_card = this.add.image(1250, 170, "back").setScale(0.2, 0.2);

        })

        this.socket.on("badHand", () => {
            console.log("Invalid hand played");
        })

        this.socket.on("newTurn", (data) => {
            this.gameData.turn = data.turn;

            this.gameData.lastHand.map((card) => card.destroy());
            this.gameData.lastHand = [];
            for (let i = 0; i < data.cards.length; ++i) {
                let card = new Card(this, data.cards[i].rank, data.cards[i].suit);
                this.gameData.lastHand.push(card.render(250 + (i * 100), 400, 1));
            }
        })

        this.socket.on("successfulPlay", () => {
            console.log("successful play")

            let removeCards = this.hand.filter((card) => card.data.values.selected)
            this.hand = this.hand.filter((card) => !card.data.values.selected)
            removeCards.map((card) => card.destroy())

            if (this.hand.length === 0) {
                this.socket.emit("winGame");
            }
        })

        this.input.on("pointerdown", (pointer, currentlyOver) => {
            if (currentlyOver[0] && currentlyOver[0].type === "Image") {
                for (let i = 0; i < this.hand.length; ++i) {
                    if (this.hand[i] === currentlyOver[0]) {
                        console.log(i)
                    }
                }
                if (currentlyOver[0].data.values.selected) {
                    currentlyOver[0].y += 50;
                } else {
                    currentlyOver[0].y -= 50;
                }
                currentlyOver[0].data.values.selected = !currentlyOver[0].data.values.selected;
                console.log(this.hand)
            }

            if (this.playerNum === this.gameData.turn) {
                if (currentlyOver[0] && currentlyOver[0].type === "Text") {
                    if (currentlyOver[0]._text === "Play Cards") {
                        let cards = this.hand.filter((card) => card.data.values.selected);
                        this.selectedCards = [];
                        for (let i = 0; i < cards.length; ++i) {
                            this.selectedCards.push({
                                rank: cards[i].data.values.rank,
                                suit: cards[i].data.values.suit
                            })
                        }
                        console.log(this.selectedCards)
                        this.selectedCards = this.selectedCards.sort((first, second) => {
                            if (first.rank === second.rank) {
                                return first.suit - second.suit;
                            } else if (((first.rank === 1 || first.rank === 2) && second.rank > 2 && second.rank !== 14) || first.rank === 14) {
                                return 1
                            } else if (((second.rank === 1 || second.rank === 2) && first.rank > 2 && first.rank !== 14) || second.rank === 14) {
                                return -1
                            }
                            return first.rank - second.rank;
                        })
                        this.socket.emit("play", {
                            cards: this.selectedCards
                        });
                    } else {
                        this.socket.emit("pass");
                    }
                }
            }
        })

        this.socket.on("gameOver", ({ message }) => {
            this.gameOverText = this.add.text(690, 420, message).setFontSize(50).setFontFamily("Comic Sans MS").setColor("#123456").disableInteractive();
        })

        this.waitingText = this.add.text(690, 420, "Waiting for players...").setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
    }

    update() {
        if (this.gameData.gameStart) {
            if (this.gameData.turn === this.playerNum) {
                this.nametag.setColor("#ff0000");
                this.opponent1_nametag.setColor("#000000");
                this.opponent2_nametag.setColor("#000000");
            } else if (this.gameData.turn === (this.playerNum % 3) + 1) {
                this.nametag.setColor("#000000");
                this.opponent1_nametag.setColor("#ff0000");
                this.opponent2_nametag.setColor("#000000");
            } else {
                this.nametag.setColor("#000000");
                this.opponent1_nametag.setColor("#000000");
                this.opponent2_nametag.setColor("#ff0000");
            }
        }
    }
}
