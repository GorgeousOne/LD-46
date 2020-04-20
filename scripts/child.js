
class Child extends Collidable{

	constructor(texture, size) {
		super(0, 0, texture.width*size*thin, texture.width*size*thin);

		this.texture = texture;
		this.width = texture.width * size;
		this.height = texture.height * size;

		this.isMirrored = false;
		this.size = size;

		this.leadPoints = [];
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2 * thin, y + this.height/2 - this.width*thin);
	}

	setTexture(texture) {
		this.texture = texture;
	}

	moveTo(pos, duration, callback) {
		this.moveOrigin = this.pos.copy();
		this.moveVector = pos.copy().sub(this.moveOrigin);
		this.moveDuration = duration;
		this.moveCallback = callback;
		this.moveStart = Date.now();
	}

	follow(player) {

		this.lead = player;
		this.leadPoints = [];

		for(let i = 0; i < 10; ++i)
			this.leadPoints.push(player.pos.copy());

		physicsHandler.removeCollidable(this);
		this.setTexture(spriteHandler.getImage('child-side'));
	}

	display() {

		if(this.lead)
			this.moveBehind();

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

		let currentOffset = timeSinceStart / this.moveDuration;
		let offset = this.moveVector.copy().mult(currentOffset);
		let newPos = this.moveOrigin.copy().add(offset);

		this.moveX(newPos.x - this.pos.x);
		this.moveY(newPos.y - this.pos.y);
	}

	moveBehind() {
		let pos = player.pos.copy();

		if (this.leadPoints.length === 0) {
			this.leadPoints.push(pos);

		} else {
			let lastPos = this.leadPoints[this.leadPoints.length-1];

			if(lastPos.dist(pos) > 0.1) {
				this.leadPoints.push(pos);
			}
		}

		if(this.leadPoints.length > 15) {
			let newPos = this.leadPoints[0];

			this.setPos(newPos.x, newPos.y);
			this.isMirrored = player.isMirrored;
			this.leadPoints.splice(0, 1);
		}
	}
}