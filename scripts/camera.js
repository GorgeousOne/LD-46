class Camera {

	constructor() {
		this.pos = createVector();
		this.focusOffset = createVector();
		this.zoom = 1;
	}

	setPos(x, y) {
		this.pos.set(x, y);
	}

	setTarget(target, followX, followY) {
		this.target = target;
		this.followTargetX = followX;
		this.followTargetY = followY;
	}

	setOffset(relX, relY) {
		this.focusOffset.set(relX, relY)
	}

	glideTo(pos, duration, idleDuration, callback) {

		this.glideOrigin = this.pos.copy();
		this.glideVector = pos.sub(this.glideOrigin);
		this.glideDuration = duration;
		this.idleDuration = idleDuration;
		this.glideCallback = callback;
		this.glideStart = Date.now();
	}

	shake(strength, duration) {

		this.isShaking = true;
		this.shakeStrength = strength;
		this.shakeDuration = duration;
		this.shakeStart = Date.now();
	}

	focus() {

		if (this.target) {
			if (this.followTargetX)
				this.pos.x = this.target.pos.x;
			if (this.followTargetY)
				this.pos.y = this.target.pos.y;
		}

		translate(width / 2 - this.focusOffset.x * width, height / 2 - this.focusOffset.y * height);
		scale(this.zoom);
		translate(-this.pos.x, -this.pos.y);

		if(this.glideVector)
			this.applyGlide();


		if(this.isShaking)
			this.applyShake();
	}

	applyGlide() {

		let timeSinceStart = Date.now() - this.glideStart;

		if(timeSinceStart > this.glideDuration + this.idleDuration) {
			this.glideVector = undefined;
			this.glideCallback();
			return;
		}

		let currentOffset = constrain(timeSinceStart / this.glideDuration, 0, 1);
		let offset = this.glideVector.copy().mult(currentOffset);

		let currentPos = this.glideOrigin.copy().add(offset);
		this.setPos(currentPos.x, currentPos.y);
	}

	applyShake() {

		let timeSinceStart = Date.now() - this.shakeStart;

		if(timeSinceStart > this.shakeDuration) {
			this.isShaking = false;
			return;
		}

		let currentStrength = (1 - (timeSinceStart / this.shakeDuration));
		currentStrength *= currentStrength * this.shakeStrength;
		translate(random(-currentStrength, currentStrength), random(-currentStrength, currentStrength));
	}
}