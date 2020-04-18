new p5();

let spriteHandler;

let player;
let stage;
let physicsHandler;
let camera;

const startTime = Date.now();

let bam;
let level1;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');
	spriteHandler.loadImage('buddy','assets/buddy.png');

	spriteHandler.loadImage('path', 'assets/path.png');
	spriteHandler.loadImage('forest', 'assets/forest-tiles.png');

	level1 = loadStrings('levels/level1.txt');
}

function setup() {

	createCanvas(windowWidth, windowHeight, P2D);
	fullscreen();

	loadLetters(spriteHandler.getImage('font'));
	physicsHandler = new PhysicsHandler();

	player = new Player(20, 20);
	player.setTexture(spriteHandler.getImage('buddy'));
	player.setPos(200, 200)
	physicsHandler.addCollidable(player);

	let forest = spriteHandler.getImage('forest');
	stage = new Stage(level1, 100);
	stage.addTex(TileType.PATH, spriteHandler.getImage('path'));
	stage.addTex(TileType.FOREST_BACK_LEFT, forest.get(0, 0, 100, 100));
	stage.addTex(TileType.FOREST_BACK_MID, forest.get(100, 0, 100, 100));
	stage.addTex(TileType.FOREST_BACK_RIGHT, forest.get(200, 0, 100, 100));
	stage.addTex(TileType.FOREST_LEFT, forest.get(0, 100, 100, 100));
	stage.addTex(TileType.FOREST, forest.get(100, 100, 100, 100));
	stage.addTex(TileType.FOREST_RIGHT, forest.get(200, 100, 100, 100));
	stage.addTex(TileType.FOREST_FRONT_LEFT, forest.get(0, 200, 100, 100));
	stage.addTex(TileType.FOREST_FRONT_MID, forest.get(100, 200, 100, 100));
	stage.addTex(TileType.FOREST_FRONT_RIGHT, forest.get(200, 200, 100, 100));

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