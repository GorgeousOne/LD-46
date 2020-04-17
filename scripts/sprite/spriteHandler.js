
class SpriteHandler {

	constructor() {
		this.images = new Map();
		this.sprites = new Map();
	}

	getImage(name) {
		return this.images.get(name);
	}

	getSprite(name) {
		return this.sprites.get(name);
	}

	loadImage(name, path) {
		this.images.set(name, loadImage(path));
	}

	loadSprite(name, directory, fileName) {

		let spritePath = directory + "/" + fileName + ".png";
		let texPath = directory + "/" + fileName + ".txt";

		loadImage(spritePath, spriteSheet => {
			loadStrings(texPath, texFile => {
				this.sprites.set(name, this.createSprite(spriteSheet, texFile));
			});
		});
	}


	createSprite(spriteSheet, texFile) {

		if (texFile.length < 2) {
			console.log('no image coordinates defined in tex file.');
			return null;
		}

		let msPerFrame = parseInt(texFile[0]);
		let frames = [];

		for (let i = 1; i < texFile.length; i++) {
			let imgCoords = texFile[i].split(' ').map(coord => parseInt(coord));

			frames.push(spriteSheet.get(
				imgCoords[0],
				imgCoords[1],
				imgCoords[2],
				imgCoords[3]
			));
		}

		return new Sprite(frames, msPerFrame);
	}
}