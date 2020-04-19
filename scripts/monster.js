class Monster extends Collidable {

	constructor(texture, size) {
		super(0, 0, texture.width*size, texture.height*size);

		this.texture = texture;
		this.width = texture.width * size;
		this.height = texture.height * size;

		this.isMirrored = false;
		this.size = size;

		this.isSolid = false;
		this.isAlvie = true;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2, y - this.height/2);
	}

	moveTo(pos, duration, callback) {
		this.moveOrigin = this.pos.copy();
		this.moveVector = pos.sub(this.moveOrigin);
		this.moveDuration = duration;
		this.moveCallback = callback;
		this.moveStart = Date.now();
	}

	display() {

		if(this.moveVector)
			this.applyMovement();

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		if (this.isMirrored)
			scale(-1, 1);

		image(this.texture, -this.texture.width/2, -this.texture.height/2);
		pop();
	}

	applyMovement() {

		let timeSinceStart = Date.now() - this.moveStart;

		if(timeSinceStart > this.moveDuration) {
			this.moveVector = undefined;
			this.moveCallback();
			return;
		}

		let currentOffset = constrain(timeSinceStart / this.moveDuration, 0, 1);
		let offset = this.moveVector.copy().mult(currentOffset);
		let newPos = this.moveOrigin.copy().add(offset);

		this.moveX(newPos.x - this.pos.x);
		this.moveY(newPos.y - this.pos.y);
	}

	onCollide(otherCollidable) {

		if(otherCollidable === player) {
			physicsHandler.removeCollidable(this);
		}
	}
}