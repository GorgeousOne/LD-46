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
	spriteHandler.loadImage('buddy','assets/buddy.png');

	spriteHandler.loadImage('path', 'assets/path.png');
	spriteHandler.loadImage('forest', 'assets/forest.png');
	spriteHandler.loadImage('forest-front', 'assets/forest-front.png');
	spriteHandler.loadImage('forest-back', 'assets/forest-back.png');

}

function setup() {

	createCanvas(windowWidth, windowHeight, P2D);
	fullscreen();
	//noSmooth();

	loadLetters(spriteHandler.getImage('font'));

	player = new Player(20, 20);
	player.setTexture(spriteHandler.getImage('buddy'));

	stage = new Stage(10, 10, 100);
	stage.addTex(spriteHandler.getImage('path'), TileType.PATH);
	stage.addTex(spriteHandler.getImage('forest'), TileType.FOREST);
	stage.addTex(spriteHandler.getImage('forest-front'), TileType.FOREST_FRONT);
	stage.addTex(spriteHandler.getImage('forest-back'), TileType.FOREST_BACK);

	physicsHandler = new PhysicsHandler();
	physicsHandler.addCollidable(player);
	// physicsHandler.addCollidable(new Ledge(createVector(400, 350), 100, 10));
	// physicsHandler.addCollidable(new Ledge(createVector(200, 455), 700, 10));

	camera = new Camera(player);
	camera.followTargetX = true;
	camera.followTargetY = true;
	camera.zoom = 1;
}

function drawTime() {

	if(keyIsDown(32))
		return;

	//fill(255, 100, 0, 32);
	fill(0, 0, 10, 200);
	rect(0, 0, windowWidth, windowHeight);

	fill()
	ellipse(windowWidth/2, windowHeight/2, 200, 200);
}

function draw() {

	physicsHandler.applyPhysics();

	background(0);

	push();
	camera.focus();

	stage.display();
	physicsHandler.collidables.forEach(collidable => collidable.hitbox.display());

	player.display();
	pop();

	//drawTime();

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