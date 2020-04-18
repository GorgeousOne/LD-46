class Collidable {

	constructor(width, height) {

		this.pos = createVector();
		this.hitbox = new Hitbox(width, height);

		this.velX = 0;
		this.velY = 0;

		this.isSolid = true;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x, y);
	}

	updateX() {
		this.moveX(this.velX);
	}


	moveX(dx) {

		this.translateX(dx);
		let otherCollidable = physicsHandler.getCollision(this);
		this.velX = 0;

		if (otherCollidable === undefined)
			return dx;

		let signX = signum(dx);
		let intersection = otherCollidable.hitbox.getBoundX(-signX) - this.hitbox.getBoundX(signX);

		this.translateX(intersection);
		return dx + intersection;
	}

	updateY() {
		this.moveY(this.velY);
	}

	moveY(dy) {

		this.translateY(dy);
		let otherCollidable = physicsHandler.getCollision(this);
		this.velY = 0;

		if (otherCollidable === undefined)
			return dy;

		let signY = signum(dy);
		let intersection = otherCollidable.hitbox.getBoundY(-signY) - this.hitbox.getBoundY(signY);

		this.translateY(intersection);
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