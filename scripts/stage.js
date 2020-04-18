class Stage {

	constructor(tileStrings) {

		this.tileTexs = new Map();
		this.tiles = [];

		for (let y = 0; y < tileStrings.length; y++) {
			let line = tileStrings[y];

			for (let x = 0; x < line.length; x++) {

				if(y === 0)
					this.tiles.push([]);

				this.tiles[x].push(parseInt(line.charAt(x)));
			}
		}
	}

	addTex(tileType, texture) {

		this.tileTexs.set(tileType, texture);
		console.log(tileType);
	}

	display() {

		for(let x = 0; x < this.tiles.length; x++) {
			for(let y = 0; y < this.tiles[0].length; y++) {

				let tex = this.tileTexs.get(this.tiles[x][y]);
				//console.log(this.tiles[x][y]);

				if(!tex)
					console.log(x + ", " + y + ", " + this.tiles[x][y] + " tex is missing");

				if(tex)
					image(tex, x * tex.width, y * tex.height);
			}
		}

		//image(this.texture, 0, 0);
	}
}