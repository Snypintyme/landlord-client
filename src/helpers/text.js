export default function makeText(scene, x, y, msg, size, interactive) { // Is this needed?
    let text = scene.add.text(x, y, msg).setFontSize(size).setFontFamily("Comic Sans MS").setColor("#000000");
    if (interactive) {
        text.setInteractive();
    } else {
        text.disableInteractive();
    }
    return text;
}
