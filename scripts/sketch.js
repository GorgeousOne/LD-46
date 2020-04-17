new p5();

let spriteHandler;

let player;
let stage;
let physicsHandler;
let camera;

let npcs;
let npcTalkingTo;

let ui;

const startTime = Date.now();

let bam;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');

	spriteHandler.loadImage('stage', 'assets/library.png');
	spriteHandler.loadImage('key', 'assets/key.png');
	spriteHandler.loadImage('hunter', 'assets/hunter.png');

	spriteHandler.loadSprite('gengar-walking','assets', 'gengar-walking');

	bam = loadSound('assets/BAMM.wav');
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

	let button = new Button(50, 50);
	button.setTexture(spriteHandler.getImage('key'));

	ui = new UI();
	ui.addButtons(button);

	let hunterText = new Dialog("Hello, curious traveller! What are you doing in such a dangerous place? " +
		"You should look out for a safe place for the night. The sun is already standing low, hurry up!",
		2, 400, 2);
	// hunterText.textColor = color(0, 128);
	// hunterText.bgColor = color(255, 0);

	let hunter = new NPC(20, 40);
	hunter.setDialog(hunterText);
	hunter.setPos(450, 310);
	hunter.setTexture(spriteHandler.getImage('hunter'));

	npcs = [];
	npcs.push(hunter);
}

function draw() {

	physicsHandler.applyPhysics();

	push();
	background(0);
	camera.focus();

	stage.display();
	physicsHandler.collidables.forEach(collidable => collidable.hitbox.display());
	npcs.forEach(npc => npc.display());

	player.display();

	if (npcTalkingTo && !npcTalkingTo.hitbox.intersects(player.hitbox)) {
		npcTalkingTo.stopTalking();
		npcTalkingTo = undefined;
	}

	pop();
	ui.display();
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
	ui.onMouseClick();
}

function mouseMoved() {
	ui.onMouseMove();
}

function keyPressed() {

	if (key !== 'e')
		return;

	if (npcTalkingTo) {
		npcTalkingTo.talk();
		return;
	}

	for (let npc of npcs) {
		if (npc.hitbox.intersects(player.hitbox)) {

			if(npc.talk())
				npcTalkingTo = npc;
		}
	}
}

function keyReleased() {

	if(player.isTalking)
		return;

	if (keyCode === UP_ARROW)
		player.hasJumpedOnce = false;
}