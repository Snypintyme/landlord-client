import io from "socket.io-client";
import makeCard from "../helpers/card.js"

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        });
    }

    preload() {
        for (let i = 1; i <= 13; ++i) {
            this.load.image(i + "_of_diamonds", "src/assets/cards/" + i + "_of_diamonds.png");
            this.load.image(i + "_of_clubs", "src/assets/cards/" + i + "_of_clubs.png");
            this.load.image(i + "_of_hearts", "src/assets/cards/" + i + "_of_hearts.png");
            this.load.image(i + "_of_spades", "src/assets/cards/" + i + "_of_spades.png");
        }
        this.load.image("black_joker", "src/assets/cards/black_joker.png");
        this.load.image("colour_joker", "src/assets/cards/colour_joker.png");
        this.load.image("back", "src/assets/cards/back.png");
    }

    create() {
        this.gameStart = false;
        this.gameData = {
            playerNum: null,
            hand: [],
            selectedCards: [],
            landlord: null,
            lardlordCard: null,
            turn: null,
            lastPlay: []
        }

        this.socket = io("http://localhost:3000"); // https://landlordserver.herokuapp.com
        this.socket.on(('connect'), () => {
            console.log("Connected to server");
        })
        this.socket.on("playerLeft", (playerIndex) => {
            if (this.playerNum > playerIndex) --this.playerNum; // come back, dosent work as intended
        })

        this.socket.on("gameStart", (data) => {
            this.waitingText.destroy();

            this.gameStart = true;
            this.gameData.playerNum = data.playerNum;
            this.gameData.landlord = data.landlord;
            this.gameData.lardlordCard = data.landlordCard;
            this.gameData.turn = data.landlord;

            let sortedCards = data.hand.sort((first, second) => {
                if (first.rank === second.rank) {
                    return first.suit - second.suit;
                }
                return first.rank - second.rank;
            });

            for (let i = 0; i < sortedCards.length; ++i) {
                this.gameData.hand.push(makeCard(this, sortedCards[i].rank, sortedCards[i].suit, 1, 250 + (i * 50), 700));
            }

            this.playButton = this.add.text(1350, 650, "Play Cards").setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").setInteractive();
            this.passButton = this.add.text(1350, 710, "Pass Turn").setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").setInteractive();

            this.teamText = this.add.text(50, 20, (data.landlord === this.gameData.playerNum) ? "You are the Landlord" : "You are a Peasant").setFontSize(24).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.landlordCardText = this.add.text(80, 60, "Landlord Card").setFontSize(18).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.landlordCardDesc = this.add.text(70, 210, "Landlord is Player " + (this.gameData.landlord + 1)).setFontSize(18).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            makeCard(this, this.gameData.lardlordCard.rank, this.gameData.lardlordCard.suit, 2, 135, 145);

            this.nametag = this.add.text(700, 830, "Player " + (this.gameData.playerNum + 1)).setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.opponent1_nametag = this.add.text(620, 50, "Player " + (((this.gameData.playerNum + 1) % 3) + 1)).setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.oppoenent1_card = makeCard(this, 20, 0, 3, 670, 170);
            this.opponent2_nametag = this.add.text(1200, 50, "Player " + (((this.gameData.playerNum + 2) % 3) + 1)).setFontSize(30).setFontFamily("Comic Sans MS").setColor("#000000").disableInteractive();
            this.oppoenent2_card = makeCard(this, 20, 0, 3, 1250, 170);
        })

        this.socket.on("invalidPlay", () => {
            console.log("Invalid hand played");
        })

        this.socket.on("newTurn", (data) => {
            this.gameData.turn = data.turn;

            this.gameData.lastPlay.map((card) => card.destroy());
            this.gameData.lastPlay = [];
            for (let i = 0; i < data.cards.length; ++i) {
                this.gameData.lastPlay.push(makeCard(this, data.cards[i].rank, data.cards[i].suit, 1, 250 + (i * 100), 400));
            }
        })

        this.socket.on("successfulPlay", () => {
            console.log("Successful Play");

            let removeCards = this.gameData.hand.filter((card) => card.data.values.selected)
            this.gameData.hand = this.gameData.hand.filter((card) => !card.data.values.selected)
            removeCards.map((card) => card.destroy())

            if (this.gameData.hand.length === 0) {
                this.socket.emit("winGame", {
                    landlordWin: (this.gameData.landlord === this.gameData.playerNum) ? true : false
                });
            }
        })

        this.input.on("pointerdown", (pointer, currentlyOver) => {
            if (currentlyOver[0]) {
                if (currentlyOver[0].type === "Image") {
                    if (currentlyOver[0].data.values.selected) {
                        currentlyOver[0].y += 50;
                    } else {
                        currentlyOver[0].y -= 50;
                    }
                    currentlyOver[0].data.values.selected = !currentlyOver[0].data.values.selected;
                } else if (currentlyOver[0].type === "Text") {
                    if (currentlyOver[0]._text === "Play Cards") {
                        let cards = this.gameData.hand.filter((card) => card.data.values.selected);
                        this.gameData.selectedCards = [];
                        for (let i = 0; i < cards.length; ++i) {
                            this.gameData.selectedCards.push({
                                rank: cards[i].data.values.rank,
                                suit: cards[i].data.values.suit
                            })
                        }

                        this.gameData.selectedCards = this.gameData.selectedCards.sort((first, second) => {
                            if (first.rank === second.rank) {
                                return first.suit - second.suit;
                            }
                            return first.rank - second.rank;
                        });
                        this.socket.emit("play", {
                            cards: this.gameData.selectedCards
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
        if (this.gameStart) {
            if (this.gameData.turn === this.gameData.playerNum) {
                this.nametag.setColor("#ff0000");
                this.opponent1_nametag.setColor("#000000");
                this.opponent2_nametag.setColor("#000000");
            } else if (this.gameData.turn === (this.gameData.playerNum + 1) % 3) {
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
