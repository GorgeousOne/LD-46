const speed = 3;

class PhysicsHandler {

	constructor() {
		this.collidables = [];
	}

	addCollidable(collidable) {
		this.collidables.push(collidable);
	}

	applyPhysics() {

		this.movePlayer();

		for (let collidable of this.collidables) {
			collidable.updateX();
			collidable.updateY();
		}
	}

	getCollision(collidable) {

		for (let other of this.collidables) {

			if (other === collidable || !other.isSolid)
				continue;

			if (collidable.hitbox.intersects(other.hitbox))
				return other;
		}
	}

	movePlayer() {

		if(player.isTalking)
			return;

		if (keyIsDown(LEFT_ARROW))
			player.velX -= speed;

		if (keyIsDown(RIGHT_ARROW))
			player.velX += speed;

		if (keyIsDown(UP_ARROW))
			player.velY -= speed;

		if (keyIsDown(DOWN_ARROW))
			player.velY += speed;

		if(player.velX !== 0 && player.velY !== 0) {
			player.velX /= sqrt(2);
			player.velY /= sqrt(2);
		}
	}
}