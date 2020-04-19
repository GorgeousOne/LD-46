
class Child extends Collidable{

	constructor(texture) {
		super(0, 0, texture.width)
		this.texture = texture;
	}

	setTexture(texture) {
		this.texture = texture;
	}

	display() {


	}
}