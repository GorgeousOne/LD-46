class Stage {

	constructor(tilesX, tilesY, tileSize) {
		this.tilesX = tilesX;
		this.tilesY = tilesY;
		this.tilesSize = tileSize;

		this.tilesTexs = new Map();
		this.tiles = [];

		for(let x = 0; x < tilesX; x++) {

			let row = [];
			this.tiles.push(row);

			for(let y = 0; y < tilesY; y++) {

				switch (y) {
					case 0:
						row.push(TileType.FOREST_BACK);
						break;
					case 1:
						row.push(TileType.FOREST);
						break;
					case 2:
						row.push(TileType.FOREST_FRONT);
						break;
					default:
						row.push(TileType.PATH);
						break;
				}
			}
		}
	}

	addTex(texture, tileType) {
		this.tilesTexs.set(tileType, texture);
	}

	display() {

		for(let x = 0; x < this.tilesX; x++) {
			for(let y = 0; y < this.tilesY; y++) {

				let tex = this.tilesTexs.get(this.tiles[x][y]);
				image(tex, x * this.tilesSize, y * this.tilesSize);
			}
		}

		//image(this.texture, 0, 0);
	}
}