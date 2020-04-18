class Player extends Collidable {

	constructor(width, height) {
		super(width, height);

		this.isWalking = false;
		this.isTalking = false;
		this.isMirrored = false;

		this.hitbox.move(-width / 2, -height / 2);
	}

	setTexture(sprite) {
		this.sprite = sprite;
	}

	updateX() {
		if(this.velX !== 0)
			this.isMirrored = this.velX > 0;
		
		super.updateX();
	}

	display() {

		if (!this.sprite)
			return;

		translate(this.pos.x + this.hitbox.width / 2, this.pos.y + this.hitbox.height / 2);


		if (this.isMirrored)
			scale(-1, 1);

		let tex = this.sprite.getFrame(this.isWalking ? Date.now() - startTime : 0);
		image(tex, -tex.width / 2, -tex.height / 2);

		if (this.isMirrored)
			scale(-1, 1);

		translate(-this.pos.x - this.hitbox.width / 2, -this.pos.y - this.hitbox.height / 2);
		this.isWalking = false;
	}
}