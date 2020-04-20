const thin = 0.5;

class Player extends Collidable {

	constructor(texture, size) {
		super(0, 0, texture.width*size*thin, texture.width*size);

		this.texture = texture;
		this.width = texture.width * size;
		this.height = texture.height * size;

		this.canMove = true;
		this.isMirrored = false;
		this.size = size;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2 * thin, y + this.height/2 - this.width);
	}

	updateX() {
		if(this.velX !== 0)
			this.isMirrored = this.velX < 0;

		super.updateX();
	}

	display() {

		if (!this.texture)
			return;

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		if (this.isMirrored)
			scale(-1, 1);

		image(this.texture, -this.texture.width/2, -this.texture.height/2);

		pop();
		this.isWalking = false;
	}
}