class Collidable {

	constructor(width, height, hasGravity = false, surfaceFriction = 1) {

		this.pos = createVector();
		this.hitbox = new Hitbox(width, height);

		this.velX = 0;
		this.velY = 0;

		this.hasGravity = hasGravity;
		this.surfaceFriction = surfaceFriction;

		this.isOnGround = false;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x, y);
	}

	updateX() {
		//makes sure that it doesnt accidentally move away from others while not in motion
		if (abs(this.velY) > 0.001) {
			this.moveX(this.velX);

			if (this.isOnGround)
				this.velX *= 1 - this.lastGround.surfaceFriction;
		}
	}


	moveX(dx) {

		this.translateX(dx);
		let otherCollidable = physicsHandler.getCollision(this);

		if (otherCollidable === undefined)
			return dx;

		let signX = signum(dx);
		let intersection = otherCollidable.hitbox.getBoundX(-signX) - this.hitbox.getBoundX(signX);

		this.translateX(intersection);
	}

	updateY() {

		if (abs(this.velY) > 0.001) {
			this.isOnGround = false;
			this.moveY(this.velY);
		}
	}

	moveY(dy) {

		this.translateY(dy);
		let otherCollidable = physicsHandler.getCollision(this);

		if (otherCollidable === undefined)
			return dy;

		let signY = signum(dy);
		let intersection = otherCollidable.hitbox.getBoundY(-signY) - this.hitbox.getBoundY(signY);

		this.translateY(intersection);
		this.velY = 0;

		if (signY === 1) {
			this.isOnGround = true;
			this.lastGround = otherCollidable;
		}

		return dy + intersection;
	}

	translateX(dx) {
		this.pos.add(dx, 0);
		this.hitbox.move(dx, 0);
	}

	translateY(dy) {
		this.pos.add(0, dy);
		this.hitbox.move(0, dy);
	}
}