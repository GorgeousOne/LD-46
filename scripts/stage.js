class Stage {

	constructor(tileSize) {

		this.tileSize = tileSize;
		this.tileTexs = new Map();
		this.tileHitboxes = new Map();
	}

	addTex(tileType, texture, tileHitbox) {
		this.tileTexs.set(tileType, texture);
		this.tileHitboxes.set(tileType, tileHitbox)
	}

	loadMap(tileStrings) {

		if(this.registeredCollidables)
			this.unloadMap();

		this.tiles = [];
		this.registeredCollidables = [];

		for (let y = 0; y < tileStrings.length; y++) {
			let line = tileStrings[y];

			for (let x = 0; x < line.length; x++) {

				if(y === 0)
					this.tiles.push([]);

				let tileID = parseInt(line.charAt(x));
				this.tiles[x].push(tileID);

				if (tileID !== 0) {

					let hitbox = this.tileHitboxes.get(tileID);
					let forest = new Collidable(
						x * this.tileSize + hitbox.pos.x,
						y * this.tileSize + hitbox.pos.y,
						hitbox.width,
						hitbox.height);

					physicsHandler.addCollidable(forest);
					this.registeredCollidables.push(forest);
				}
			}
		}
	}

	unloadMap() {
		for(let coll of this.registeredCollidables) {
			physicsHandler.removeCollidable(coll);
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