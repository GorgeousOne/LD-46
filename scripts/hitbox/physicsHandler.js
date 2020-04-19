// const speed = 1.75;
const speed = 15.75;

class PhysicsHandler {

	constructor() {
		this.collidables = [];
	}

	addCollidable(collidable) {
		this.collidables.push(collidable);
	}

	removeCollidable(collidable) {

		if(!collidable)
			throw 'collidable is undefined';

		for(let i = 0; i < this.collidables.length; i++) {
			if (this.collidables[i] === collidable) {
				this.collidables.splice(i, 1);
				return;
			}
		}
	}

	applyPhysics() {

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
}