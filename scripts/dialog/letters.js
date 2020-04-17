const letterHeight = 9;
const Letters = new Map();

Letters.set(' ', new LetterExtent(16, 71, 3, 7));
Letters.set('A', new LetterExtent(0, 0, 5, 7));
Letters.set('B', new LetterExtent(5, 0, 5, 7));
Letters.set('C', new LetterExtent(10, 0, 4, 7));
Letters.set('D', new LetterExtent(14, 0, 5, 7));
Letters.set('E', new LetterExtent(19, 0, 4, 7));
Letters.set('F', new LetterExtent(23, 0, 4, 7));
Letters.set('G', new LetterExtent(27, 0, 4, 7));
Letters.set('H', new LetterExtent(31, 0, 4, 7));
Letters.set('I', new LetterExtent(35, 0, 3, 7));
Letters.set('J', new LetterExtent(38, 0, 4, 7));
Letters.set('K', new LetterExtent(42, 0, 4, 7));
Letters.set('L', new LetterExtent(46, 0, 4, 7));
Letters.set('M', new LetterExtent(50, 0, 5, 7));
Letters.set('N', new LetterExtent(55, 0, 5, 7));
Letters.set('O', new LetterExtent(60, 0, 5, 7));
Letters.set('P', new LetterExtent(65, 0, 4, 7));
Letters.set('Q', new LetterExtent(69, 0, 5, 7));
Letters.set('R', new LetterExtent(74, 0, 4, 7));
Letters.set('S', new LetterExtent(78, 0, 4, 7));
Letters.set('T', new LetterExtent(82, 0, 5, 7));
Letters.set('U', new LetterExtent(87, 0, 5, 7));
Letters.set('V', new LetterExtent(92, 0, 5, 7));
Letters.set('W', new LetterExtent(97, 0, 5, 7));
Letters.set('X', new LetterExtent(102, 0, 5, 7));
Letters.set('Y', new LetterExtent(107, 0, 5, 7));
Letters.set('Z', new LetterExtent(112, 0, 5, 7));
Letters.set('a', new LetterExtent(0, 7, 4, 7));
Letters.set('b', new LetterExtent(4, 7, 4, 7));
Letters.set('c', new LetterExtent(8, 7, 3, 7));
Letters.set('d', new LetterExtent(11, 7, 4, 7));
Letters.set('e', new LetterExtent(15, 7, 4, 7));
Letters.set('f', new LetterExtent(19, 7, 3, 7));
Letters.set('g', new LetterExtent(22, 7, 4, 9));
Letters.set('h', new LetterExtent(26, 7, 4, 7));
Letters.set('i', new LetterExtent(30, 7, 1, 7));
Letters.set('j', new LetterExtent(31, 7, 2, 9));
Letters.set('k', new LetterExtent(33, 7, 4, 7));
Letters.set('l', new LetterExtent(37, 7, 2, 7));
Letters.set('m', new LetterExtent(39, 7, 5, 7));
Letters.set('n', new LetterExtent(44, 7, 4, 7));
Letters.set('o', new LetterExtent(48, 7, 4, 7));
Letters.set('p', new LetterExtent(52, 7, 4, 9));
Letters.set('q', new LetterExtent(56, 7, 4, 9));
Letters.set('r', new LetterExtent(60, 7, 4, 7));
Letters.set('s', new LetterExtent(64, 7, 3, 8));
Letters.set('t', new LetterExtent(67, 7, 3, 7));
Letters.set('u', new LetterExtent(70, 7, 4, 7));
Letters.set('v', new LetterExtent(74, 7, 5, 7));
Letters.set('w', new LetterExtent(79, 7, 5, 7));
Letters.set('x', new LetterExtent(84, 7, 5, 7));
Letters.set('y', new LetterExtent(89, 7, 4, 8));
Letters.set('z', new LetterExtent(93, 7, 4, 7));
Letters.set('.', new LetterExtent(97, 7, 1, 7));
Letters.set(',', new LetterExtent(98, 7, 1, 8));
Letters.set('!', new LetterExtent(99, 7, 1, 7));
Letters.set('?', new LetterExtent(100, 7, 5, 7));
Letters.set('&', new LetterExtent(105, 7, 5, 7));
Letters.set('\"', new LetterExtent(110, 7, 3, 7));
Letters.set('\'', new LetterExtent(113, 7, 1, 7));
Letters.set(':', new LetterExtent(114, 7, 1, 7));
Letters.set(';', new LetterExtent(115, 7, 1, 7));
Letters.set('0', new LetterExtent(0, 16, 4, 7));
Letters.set('1', new LetterExtent(4, 16, 1, 7));
Letters.set('2', new LetterExtent(5, 16, 4, 7));
Letters.set('3', new LetterExtent(9, 16, 4, 7));
Letters.set('4', new LetterExtent(13, 16, 4, 7));
Letters.set('5', new LetterExtent(17, 16, 4, 7));
Letters.set('6', new LetterExtent(21, 16, 4, 7));
Letters.set('7', new LetterExtent(25, 16, 4, 7));
Letters.set('8', new LetterExtent(29, 16, 4, 7));
Letters.set('9', new LetterExtent(33, 16, 4, 7));
Letters.set('+', new LetterExtent(37, 16, 5, 7));
Letters.set('-', new LetterExtent(42, 16, 4, 7));
Letters.set('=', new LetterExtent(46, 16, 4, 7));
Letters.set('(', new LetterExtent(50, 16, 2, 7));
Letters.set(')', new LetterExtent(52, 16, 2, 7));
Letters.set('|', new LetterExtent(54, 16, 1, 7));
Letters.set('*', new LetterExtent(55, 16, 3, 7));
Letters.set('<', new LetterExtent(58, 16, 3, 7));
Letters.set('>', new LetterExtent(61, 16, 3, 7));
Letters.set('$', new LetterExtent(64, 16, 5, 7));

const LetterImages = new Map();

function loadLetters(img) {

	for (let [char, extent] of Letters.entries())
		LetterImages.set(char, img.get(extent.x, extent.y, extent.w, extent.h))
}

function getWidth(word, fontSize = 1) {

	let width = 0;

	for (let i = 0; i < word.length; i++) {

		//add a pixel space between each letter
		if (i !== 0) width += 1;
		width += Letters.get(word.charAt(i)).w;
	}

	return width * fontSize;
}



