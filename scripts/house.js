
class House {

	constructor(pos, texture, size) {
		this.pos = pos;
		this.texture = texture;
		this.size = size;
	}

	display() {

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		if (this.isMirrored)
			scale(-1, 1);

		image(this.texture, -this.texture.width/2, -this.texture.height/2);
		pop();
	}}