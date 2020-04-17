class NPC {

	constructor(width, height) {

		this.hitbox = new Hitbox(width, height);
		this.pos = createVector();
		this.isTalking = false;
	}

	setPos(x, y) {
		this.pos.set(x, y);
		this.hitbox.setPos(x, y);
	}

	setTexture(texture) {
		this.texture = texture;
	}

	setDialog(dialog) {
		this.dialog = dialog;
	}

	talk() {

		if(!this.dialog)
			return false;

		if(this.dialog.hasEnded) {
			this.stopTalking();

		}else {
			this.isTalking = true;
			player.isTalking = true;
			this.dialog.loadNextBubble();
		}

		return true;
	}

	stopTalking() {

		if(!this.dialog)
			return true;

		this.isTalking = false;
		player.isTalking = false;
		this.dialog.reset();
	}

	display() {

		if (!this.texture)
			return;

		image(this.texture, this.pos.x, this.pos.y);

		if(this.isTalking)
			this.dialog.display(this.pos.copy().add(this.hitbox.width/2, 0));
	}
}