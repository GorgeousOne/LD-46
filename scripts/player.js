const thin = 0.8;

class Player extends Collidable {

	constructor(sprite, size) {
		super(0, 0, sprite.width*size*thin, sprite.width*size*thin);

		this.width = sprite.width * size;
		this.height = sprite.height * size;

		this.sprite = sprite;
		this.isWalking = false;
		this.isTalking = false;
		this.isMirrored = false;
		this.size = size;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2 * thin, y);
	}

	updateX() {
		if(this.velX !== 0)
			this.isMirrored = this.velX < 0;

		super.updateX();
	}

	display() {

		if (!this.sprite)
			return;

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		if (this.isMirrored)
			scale(-1, 1);

		// let tex = this.sprite.getFrame(this.isWalking ? Date.now() - startTime : 0);

		image(this.sprite, -this.sprite.width/2, -this.sprite.height/2);

		if (this.isMirrored)
			scale(-1, 1);

		pop();
		this.isWalking = false;
	}
}