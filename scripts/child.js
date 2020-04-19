
class Child extends Collidable{

	constructor(texture, size) {
		super(0, 0, texture.width*size*thin, texture.width*size*thin);

		this.width = texture.width * size;
		this.height = texture.height * size;

		this.texture = texture;
		this.isMirrored = false;
		this.size = size;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x - this.width/2 * thin, y);
	}

	setDialog(dialog) {

		let dialogPos = this.pos.copy().add(this.width/2, 0).sub(-this.width/2, -this.height);
		dialog.setPos(dialogPos.x, dialogPos.y);

		this.dialog = dialog;
		this.wantsToTalk = true;
	}

	getDialog() {
		this.wantsToTalk = false;
		this.isTalking = true;
		return this.dialog;
	}

	setTexture(texture) {
		this.texture = texture;
	}

	follow(player) {

		this.player = player;
	}

	display() {

		push();
		translate(this.pos.x, this.pos.y);
		scale(this.size);

		if (this.isMirrored)
			scale(-1, 1);

		image(this.texture, -this.texture.width/2, -this.texture.height/2);

		if (this.isMirrored)
			scale(-1, 1);

		pop();
	}
}