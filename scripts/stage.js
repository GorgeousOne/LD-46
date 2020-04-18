class Stage {

	constructor(tileStrings, tileSize) {

		this.tileTexs = new Map();
		this.tileHitboxes = new Map();
		this.tiles = [];
		this.tileSize = tileSize;

		for (let y = 0; y < tileStrings.length; y++) {
			let line = tileStrings[y];

			for (let x = 0; x < line.length; x++) {

				if(y === 0)
					this.tiles.push([]);

				let tileID = parseInt(line.charAt(x));
				this.tiles[x].push(tileID);
			}
		}
	}

	addTex(tileType, texture, tileHitbox) {
		this.tileTexs.set(tileType, texture);
		this.tileHitboxes.set(tileType, tileHitbox)
	}

	loadHitboxes() {

		for(let x = 0; x < this.tiles.length; x++) {
			for(let y = 0; y < this.tiles[0].length; y++) {

				let tileID = this.tiles[x][y];

				if (tileID !== 0) {
					let hitbox = this.tileHitboxes.get(tileID);

					physicsHandler.addCollidable(new Collidable(
						x * this.tileSize + hitbox.pos.x,
						y * this.tileSize + hitbox.pos.y,
						hitbox.width,
						hitbox.height));

				}
			}
		}
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