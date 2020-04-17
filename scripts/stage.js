class Stage {

	constructor() {
	}

	setTexture(texture) {
		this.texture = texture;
	}

	display() {

		if (!this.texture)
			return;

		image(this.texture, 0, 0);
	}
}