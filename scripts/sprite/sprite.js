class Sprite {

	constructor(frames, msPerFrame) {
		this.frames = frames;
		this.msPerFrame = msPerFrame;
	}

	getFrame(time) {
		return this.frames[Math.floor((time / this.msPerFrame)) % this.frames.length];
	}
}