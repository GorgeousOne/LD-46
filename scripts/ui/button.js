class Button {

	constructor(width, height) {
		this.pos = createVector();
		this.bounds = new Hitbox(width, height);
		this.isHovered = false;
	}

	setTexture(texture) {
		this.texture = texture;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.bounds.setPos(x, y);
	}

	display() {

		push();
		translate(
			this.pos.x + this.bounds.width / 2,
			this.pos.y + this.bounds.height / 2);

		if (this.isHovered)
			scale(1.2, 1.2);

		if (this.texture)
			image(this.texture, -this.bounds.width / 2, -this.bounds.height / 2, this.bounds.width, this.bounds.height);
		else
			rect(-this.bounds.width / 2, -this.bounds.height / 2, this.bounds.width, this.bounds.height);

		pop();
	}


	onClick() {
		console.log("no action assigned to this button");
	}
}