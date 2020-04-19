class Collidable {

	constructor(x, y, width, height) {

		this.pos = createVector(x, y);
		this.hitbox = new Hitbox(x, y, width, height);

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
		this.velX = 0;
		let otherCollidable = physicsHandler.getCollision(this);

		if (otherCollidable === undefined)
			return dx;

		let intersection;

		if(otherCollidable.isSolid) {
			let signX = signum(dx);
			intersection = otherCollidable.hitbox.getBoundX(-signX) - this.hitbox.getBoundX(signX);
			this.translateX(intersection);
		}

		this.onCollide();
		otherCollidable.onCollide();

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

		let intersection = 0;

		if(otherCollidable.isSolid) {
			let signY = signum(dy);
			intersection = otherCollidable.hitbox.getBoundY(-signY) - this.hitbox.getBoundY(signY);
			this.translateY(intersection);
		}

		this.onCollide();
		otherCollidable.onCollide();

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

	onCollide() {}
}