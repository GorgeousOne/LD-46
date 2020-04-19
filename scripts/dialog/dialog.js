
class Dialog {

	constructor(text, linesPerBubble = 1, width = 100, fontSize = 1) {

		this.pos = createVector();
		this.linesPerBubble = linesPerBubble;
		this.fontSize = fontSize;

		this.textColor = color(0);
		this.bgColor = color(255);

		this.paddingX = 3*fontSize;
		this.paddingY = 3*fontSize;
		this.lineSpacing = fontSize;

		this.width = width;
		this.textLines = this.createTextLines(text);
		this.height =
			linesPerBubble * letterHeight * fontSize +
			(this.textLines.length - 1) * this.lineSpacing +
			2 * this.paddingY;

		this.isUiLevel = false;
		this.reset();
	}

	setPos(x, y) {
		this.pos.set(x, y);
	}

	placeAboveHead(player) {
		let newPos = player.pos.copy().sub(0, player.height/2);
		newPos.sub(this.width/2, this.height);

		this.setPos(newPos.x, newPos.y);
	}

	reset() {
		this.lineIterator = -this.linesPerBubble;
		this.hasEnded = false;
		this.loadNextBubble();
	}

	setCallback(callback) {
		this.callback = callback;
	}

	loadNextBubble() {

		let paragraphLines;

		if(this.currentBubble && ((this.linesPerBubble < 1 || this.lineIterator >= this.textLines.length-1))) {

			this.hasEnded = true;

			if(this.callback)
				this.callback();

			return;
		}

		if(this.linesPerBubble < 1) {
			paragraphLines = this.textLines;

		}else {
			this.lineIterator += this.linesPerBubble;
			let lastLineInParagraph = this.lineIterator + this.linesPerBubble;

			if(lastLineInParagraph >= this.textLines.length)
				lastLineInParagraph = min(lastLineInParagraph, this.textLines.length);

			paragraphLines = this.textLines.slice(this.lineIterator, lastLineInParagraph);
		}

		this.currentBubble = new TextBubble(paragraphLines, this.width, this.fontSize, this.textColor, this.bgColor, this.paddingX, this.paddingY, this.lineSpacing);
	}

	display() {

		push();
		noSmooth();
		this.currentBubble.display(this.pos.x, this.pos.y);
		pop();
	}

	createTextLines(text) {

		let lines = [];
		let words = text.split(' ');
		this.width = max(this.width, this.widestWord(words, this.fontSize) + 2 * this.paddingX);

		let lineWidth = 0;

		for (let word of words) {

			let wordWidth = getWidth(word + ' ', this.fontSize);

			if (lineWidth === 0 || lineWidth + wordWidth > this.width - 2 * this.paddingX) {
				lines.push(word + ' ');
				lineWidth = wordWidth;
				continue;
			}

			let lastIndex = lines.length - 1;
			lines[lastIndex] = lines[lastIndex] + word + ' ';
			lineWidth += wordWidth + this.fontSize;
		}

		return lines;
	}

	widestWord(words, fontSize) {

		let wordWidths = words.map(word => getWidth(word, fontSize));

		return wordWidths.reduce(function (champ, contender) {
			return (contender > champ) ? contender : champ;
		});
	}
}