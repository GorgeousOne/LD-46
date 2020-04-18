new p5();

let spriteHandler;

let player;
let stage;
let physicsHandler;
let camera;

const startTime = Date.now();

let level1;
let activeDialog;

let cryTrigger;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');
	spriteHandler.loadImage('buddy','assets/buddy2.png');

	spriteHandler.loadImage('path', 'assets/path.png');
	spriteHandler.loadImage('forest', 'assets/forest-tiles.png');

	level1 = loadStrings('levels/level1.txt');
}

function setup() {

	createCanvas(windowWidth, windowHeight, P2D);
	fullscreen();
	noSmooth();

	loadLetters(spriteHandler.getImage('font'));
	physicsHandler = new PhysicsHandler();

	player = new Player(spriteHandler.getImage('buddy'), 0.125);
	player.setPos(250, 750);
	physicsHandler.addCollidable(player);

	camera = new Camera(player);
	camera.followTargetX = true;
	camera.followTargetY = true;
	camera.zoom = 3;

	let forest = spriteHandler.getImage('forest');
	stage = new Stage(level1, 100);
	stage.addTex(TileType.PATH, spriteHandler.getImage('path'));
	stage.addTex(TileType.FOREST_BACK_LEFT, forest.get(0, 0, 100, 100), new Hitbox(25, 25, 75, 75));
	stage.addTex(TileType.FOREST_BACK_MID, forest.get(100, 0, 100, 100), new Hitbox(0, 25, 100, 75));
	stage.addTex(TileType.FOREST_BACK_RIGHT, forest.get(200, 0, 100, 100), new Hitbox(0, 25, 75, 75));
	stage.addTex(TileType.FOREST_LEFT, forest.get(0, 100, 100, 100), new Hitbox(25, 0, 75, 100));
	stage.addTex(TileType.FOREST, forest.get(100, 100, 100, 100), new Hitbox(0, 0, 100, 100));
	stage.addTex(TileType.FOREST_RIGHT, forest.get(200, 100, 100, 100), new Hitbox(0, 0, 75, 100));
	stage.addTex(TileType.FOREST_FRONT_LEFT, forest.get(0, 200, 100, 100), new Hitbox(25, 0, 75, 75));
	stage.addTex(TileType.FOREST_FRONT_MID, forest.get(100, 200, 100, 100), new Hitbox(0, 0, 100, 75));
	stage.addTex(TileType.FOREST_FRONT_RIGHT, forest.get(200, 200, 100, 100), new Hitbox(0, 0, 75, 75));
	stage.loadHitboxes();

	cryTrigger = new Collidable(800, 400, 10, 200);

	cryTrigger.onCollide = function () {
		activeDialog = new Dialog("WAAAAAAH!", 1, 100, 2);
		activeDialog.setPos(880, 500);
		console.log(activeDialog.pos)
		console.log(activeDialog.currentBubble.width);
		physicsHandler.removeCollidable(cryTrigger);
	};

	physicsHandler.addCollidable(cryTrigger);
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

	movePlayer();
	physicsHandler.applyPhysics();

	background(0);

	push();
	camera.focus();

	noSmooth();
	stage.display();
	physicsHandler.collidables.forEach(collidable => collidable.hitbox.display());

	smooth();
	player.display();

	if(activeDialog && !activeDialog.isUiLevel)
		activeDialog.display();

	pop();

	if(activeDialog && activeDialog.isUiLevel)
		activeDialog.display();
		// activeDialog.display(700, 700);

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

function movePlayer() {

	if(activeDialog)
		return;

	if (keyIsDown(65) || keyIsDown(LEFT_ARROW))
		player.velX -= speed;

	if (keyIsDown(68) || keyIsDown(RIGHT_ARROW))
		player.velX += speed;

	if (keyIsDown(87) || keyIsDown(UP_ARROW))
		player.velY -= speed;

	if (keyIsDown(83) || keyIsDown(DOWN_ARROW))
		player.velY += speed;

	if(player.velX !== 0 && player.velY !== 0) {
		player.velX /= sqrt(2);
		player.velY /= sqrt(2);
	}
}

function keyPressed() {

	if (key !== 'e')
		return;

	if (activeDialog) {

		console.log("next bubble")
		activeDialog.loadNextBubble();

		if(activeDialog.hasEnded) {
			console.log("end");
			activeDialog = undefined;
		}
	}
}

function changeLevel() {


}