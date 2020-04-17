
class Dialog {

	constructor(text, linesPerBubble = -1, width = 100, fontSize = 1) {

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

		this.reset();
	}

	reset() {
		this.lineIterator = -this.linesPerBubble;
		this.hasEnded = false;
	}

	loadNextBubble() {

		let paragraphLines;

		if(this.linesPerBubble < 1) {
			paragraphLines = this.textLines;
			this.hasEnded = true;

		}else {
			this.lineIterator += this.linesPerBubble;
			let lastLine = this.lineIterator + this.linesPerBubble;

			if(lastLine >= this.textLines.length) {
				lastLine = min(lastLine, this.textLines.length);
				this.hasEnded = true;
			}
			paragraphLines = this.textLines.slice(this.lineIterator, lastLine);
		}

		this.currentBubble = new TextBubble(paragraphLines, this.width, this.fontSize, this.textColor, this.bgColor, this.paddingX, this.paddingY, this.lineSpacing);
	}

	display(pos) {

		push();
		translate(pos.x, pos.y);
		scale(1 / camera.zoom);

		this.currentBubble.display(createVector(-this.width/2, -this.height));
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
			//add the length of the word plus that one pixel that will be added between the words
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