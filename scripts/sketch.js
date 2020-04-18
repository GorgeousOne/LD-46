new p5();

let spriteHandler;

let player;
let stage;
let physicsHandler;
let camera;

const startTime = Date.now();

let bam;

function preload() {

	spriteHandler = new SpriteHandler();

	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');
	spriteHandler.loadImage('stage', 'assets/library.png');
	spriteHandler.loadSprite('gengar-walking','assets', 'gengar-walking');
}

function setup() {

	createCanvas(windowWidth, windowHeight, P2D);
	fullscreen();
	noSmooth();

	loadLetters(spriteHandler.getImage('font'));

	player = new Player(20, 20);
	player.setPos(450, 310);
	player.setTexture(spriteHandler.getSprite('gengar-walking'));

	stage = new Stage();
	stage.setTexture(spriteHandler.getImage('stage'));

	physicsHandler = new PhysicsHandler();
	physicsHandler.addCollidable(player);
	physicsHandler.addCollidable(new Ledge(createVector(400, 350), 100, 10));
	physicsHandler.addCollidable(new Ledge(createVector(200, 455), 700, 10));

	camera = new Camera(player);
	camera.followTargetX = true;
	camera.followTargetY = true;
	camera.zoom = 3;
}

function draw() {

	physicsHandler.applyPhysics();

	background(0);
	camera.focus();

	stage.display();
	physicsHandler.collidables.forEach(collidable => collidable.hitbox.display());
	// npcs.forEach(npc => npc.display());

	player.display();

	// if (npcTalkingTo && !npcTalkingTo.hitbox.intersects(player.hitbox)) {
	// 	npcTalkingTo.stopTalking();
	// 	npcTalkingTo = undefined;
	// }
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function signum(f) {
	if (f > 0) return 1;
	if (f < 0) return -1;
	return 0;
}

function mouseClicked() {
	// ui.onMouseClick();
}

function mouseMoved() {
	// ui.onMouseMove();
}

// function keyPressed() {
//
// 	if (key !== 'e')
// 		return;
//
// 	if (npcTalkingTo) {
// 		npcTalkingTo.talk();
// 		return;
// 	}
//
// 	for (let npc of npcs) {
// 		if (npc.hitbox.intersects(player.hitbox)) {
//
// 			if(npc.talk()) {
// 				// npcTalkingTo = npc;
// 			}
// 		}
// 	}
// }