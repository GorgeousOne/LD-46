class Ledge extends Collidable {

	constructor(pos, width, height) {
		super(width, height);
		this.setPos(pos);
	}

	display() {
		this.hitbox.display();
	}
}