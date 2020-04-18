class Stage {

	constructor(tileStrings, tileSize) {

		this.tileTexs = new Map();
		this.tiles = [];

		for (let y = 0; y < tileStrings.length; y++) {
			let line = tileStrings[y];

			for (let x = 0; x < line.length; x++) {

				if(y === 0)
					this.tiles.push([]);

				let tileID = parseInt(line.charAt(x));
				this.tiles[x].push(tileID);

				if(tileID !== 0) {
					physicsHandler.addCollidable(new Collidable(
						x*tileSize,
						y*tileSize,
						tileSize,
						tileSize));
				}
			}
		}
	}

	addTex(tileType, texture) {
		this.tileTexs.set(tileType, texture);
	}

	display() {

		for(let x = 0; x < this.tiles.length; x++) {
			for(let y = 0; y < this.tiles[0].length; y++) {

				let tex = this.tileTexs.get(this.tiles[x][y]);
				image(tex, x * tex.width, y * tex.height);
			}
		}
	}
}