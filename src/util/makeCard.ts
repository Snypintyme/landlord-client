export default function makeCard(
  scene: Phaser.Scene,
  rank: number,
  suit: number,
  type: number,
  x: number,
  y: number
): Phaser.GameObjects.Image {
  let sprite = rank + '_of_';
  if (rank === 20) {
    sprite = 'back';
  } else if (rank === 14) {
    sprite = 'black_joker';
  } else if (rank === 15) {
    sprite = 'colour_joker';
  } else if (suit === 1) {
    sprite += 'diamonds';
  } else if (suit === 2) {
    sprite += 'clubs';
  } else if (suit === 3) {
    sprite += 'hearts';
  } else {
    sprite += 'spades';
  }

  let card = scene.add.image(x, y, sprite);
  if (type === 1) {
    card.setScale(0.25, 0.25).setInteractive();
  } else if (type === 2) {
    card.setScale(0.15, 0.15).disableInteractive();
  } else {
    card.setScale(0.2, 0.2).disableInteractive();
  }
  card.setData({
    rank: rank,
    suit: suit,
    selected: false,
  });
  return card;
}
