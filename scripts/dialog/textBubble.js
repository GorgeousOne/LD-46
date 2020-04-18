class TextBubble {

	constructor(textLines, width, fontSize, textColor, bgColor, paddingX, paddingY, lineSpacing) {

		this.textLines = textLines;
		this.fontSize = fontSize;

		this.paddingX = paddingX;
		this.paddingY = paddingY;
		this.lineSpacing = lineSpacing;

		this.textGraphic = null;
		this.textColor = textColor;
		this.background = bgColor;

		this.width = width;
		this.height =
			this.textLines.length * letterHeight * fontSize +
			(this.textLines.length - 1) * this.lineSpacing +
			2 * this.paddingY;

		if (LetterImages.size !== 0)
			this.createTextGraphic();
	}

	display(x, y) {

		if (LetterImages.size === 0)
			return;

		if (this.textGraphic === null)
			this.createTextGraphic();

		fill(this.background);
		stroke(this.textColor);
		strokeWeight(this.fontSize);

		rect(x, y, this.width, this.height);
		image(this.textGraphic, x + this.paddingX-1, y + this.paddingY-1);
	}

	createTextGraphic() {

		this.textGraphic = createGraphics(this.width, this.height);

		this.textGraphic.noSmooth();
		this.textGraphic.scale(this.fontSize);
		this.textGraphic.tint(this.textColor);

		let cursorPos = createVector(1, 1);

		for (let line of this.textLines) {
			for (let i = 0; i < line.length; i++) {

				let nextChar = line.charAt(i);
				let charImg = LetterImages.get(nextChar);

				this.textGraphic.image(charImg, cursorPos.x, cursorPos.y);
				cursorPos.add(charImg.width + 1, 0);
			}

			cursorPos.add(0, letterHeight + this.lineSpacing);
			cursorPos.x = 1;
		}
	}
}