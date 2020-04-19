new p5();

let spriteHandler;

let player;
let stage;
let physicsHandler;
let camera;

const startTime = Date.now();

let levels;
let currentLevel;

let activeDialog;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');
	spriteHandler.loadImage('buddy','assets/buddy2.png');

	spriteHandler.loadImage('path', 'assets/path.png');
	spriteHandler.loadImage('forest', 'assets/forest-tiles.png');

	levels = [];

	levels.push(loadStrings('levels/level1.txt'));
	levels.push(loadStrings('levels/level2.txt'))
}

function setup() {

	createCanvas(windowWidth, windowHeight, P2D);
	fullscreen();
	noSmooth();

	loadLetters(spriteHandler.getImage('font'));
	physicsHandler = new PhysicsHandler();

	player = new Player(spriteHandler.getImage('buddy'), 0.125);
	physicsHandler.addCollidable(player);

	camera = new Camera();
	camera.setTarget(player, true, true);
	camera.zoom = 3;

	let forest = spriteHandler.getImage('forest');
	stage = new Stage(100);
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

	currentLevel = -1;
	changeLevel();
}

function drawTime() {

	if(keyIsDown(32))
		return;

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
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function movePlayer() {

	if(!player.canMove || activeDialog)
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
			player.canMove = true;
			activeDialog = undefined;
		}
	}
}

function signum(f) {
	if (f > 0) return 1;
	if (f < 0) return -1;
	return 0;
}

function changeLevel() {

	currentLevel++;

	switch (currentLevel) {
		case 0:
			player.setPos(250, 750);

			let cryTrigger = new Collidable(825, 400, 10, 200);
			let nextLevelTrigger = new Collidable(1000, 400, 10, 200);

			physicsHandler.addCollidable(cryTrigger);
			physicsHandler.addCollidable(nextLevelTrigger);

			cryTrigger.onCollide = function() {
				physicsHandler.removeCollidable(cryTrigger);

				activeDialog = new Dialog("WAAAAAAH!", 1, 100, 7);
				activeDialog.setPos(windowWidth - activeDialog.width - 25, windowHeight/2);
				activeDialog.isUiLevel = true;

				camera.shake(5, 1000);
			};

			nextLevelTrigger.onCollide = function() {
				physicsHandler.removeCollidable(nextLevelTrigger);
				nextLevelTrigger.onCollide = function () {};
				changeLevel();
			};

			stage.loadMap(levels[currentLevel]);
			break;

		case 1:
			player.setPos(100, 500);
			stage.loadMap(levels[currentLevel]);

			let lookAtChildTrigger = new Collidable(300, 400, 10, 200);
			physicsHandler.addCollidable(lookAtChildTrigger);

			lookAtChildTrigger.onCollide = function() {

				physicsHandler.removeCollidable(lookAtChildTrigger);

				player.canMove = false;
				camera.setTarget(undefined);
				camera.glideTo(createVector(500, 500), 2000, callback => {
					camera.setTarget(player, true, true);
					player.canMove = true;
				});
			};

			break;

		default:
			console.log("what level is this?");
			break;
	}
}
