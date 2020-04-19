
class Campfire extends Collidable {

	constructor(texture, size) {
		super(0, 0, texture.width*size, texture.height*size*thin);

		this.texture = texture;
		this.size = size;
		this.width = texture.width * size;
		this.height = texture.height * size;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2, y + this.height/2 - this.width*thin);
	}

	display() {

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		image(this.texture, -this.texture.width/2, -this.texture.height/2);
		pop();
	}
}