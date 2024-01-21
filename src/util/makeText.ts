export default function makeText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  msg: string | string[],
  size: string | number,
  interactive: boolean
): Phaser.GameObjects.Text {
  let text = scene.add.text(x, y, msg).setFontSize(size).setFontFamily('Comic Sans MS').setColor('#000000');
  if (interactive) {
    text.setInteractive();
  } else {
    text.disableInteractive();
  }
  return text;
}
