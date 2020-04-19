
class Child extends Collidable{

	constructor(texture, size) {
		super(0, 0, texture.width*size*thin, texture.height*size);

		this.width = texture.width * size;
		this.height = texture.height * size;

		this.texture = texture;
		this.isMirrored = false;
		this.size = size;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2 * thin, y);
	}

	setTexture(texture) {
		this.texture = texture;
	}

	display() {

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		if (this.isMirrored)
			scale(-1, 1);

		image(this.texture, -this.texture.width/2, -this.texture.height/2);

		if (this.isMirrored)
			scale(-1, 1);

		pop();
	}
}