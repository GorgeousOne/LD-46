const gravity = 0.2;
const maxVel = 50;

const speed = 2;
const maxSpeed = 2;

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

			if (collidable.hasGravity)
				collidable.velY = constrain(collidable.velY + gravity, -maxVel, maxVel);

			collidable.updateX();
			collidable.updateY();
		}
	}

	getCollision(collidable) {

		for (let other of this.collidables) {

			if (other === collidable)
				continue;

			if (collidable.hitbox.intersects(other.hitbox))
				return other;
		}
	}

	movePlayer() {

		if(player.isTalking)
			return;

		if (keyIsDown(LEFT_ARROW))
			player.walk(-speed, maxSpeed);

		if (keyIsDown(RIGHT_ARROW))
			player.walk(speed, maxSpeed);

		if (keyIsDown(UP_ARROW))
			player.jump(110);
	}
}