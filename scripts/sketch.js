new p5();

const startTime = Date.now();

let spriteHandler;
let physicsHandler;
let camera;

let player;
let child;
let stage;

let levels;
let currentLevel;

let activeDialog;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');
	spriteHandler.loadImage('buddy','assets/buddy2.png');
	spriteHandler.loadImage('child-sobbing','assets/child-sobbing.png');
	spriteHandler.loadImage('child','assets/child.png');

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
	if(child)
		child.display();
	player.display();


	if(activeDialog && !activeDialog.isUiLevel)
		activeDialog.display();

	pop();

	ellipse(windowWidth/2, windowHeight/2, 4,4 );

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

	if (key !== 'e' && keyCode !== ENTER && key !== ' ')
		return;

	if (activeDialog) {

		console.log("next bubble");
		activeDialog.loadNextBubble();

		if(activeDialog.hasEnded) {
			console.log("end");
			player.canMove = true;
			activeDialog = undefined;
		}

		return;
	}

	if (child && !child.player && player.pos.dist(child.pos) < player.width*2) {
		firstTalk();
	}
}

function firstTalk() {

	player.isMirrored = player.pos.x > child.pos.x;

	activeDialog = new Dialog('Woah calm down!', 2,  150);
	let second = new Dialog('What are you doing here all alone?', 2, 150);
	let third = new Dialog('Where are your parents?', 2, 150);
	let fourth = new Dialog('I guess I cant just leave you here. Come on, lets go find your parents.', 2, 150);

	activeDialog.placeAboveHead(player);
	second.placeAboveHead(player);
	third.placeAboveHead(player);
	fourth.placeAboveHead(player);

	activeDialog.setCallback(() => {
		child.setTexture(spriteHandler.getImage('child'))
		activeDialog = second;
	});

	second.setCallback(() => {
		player.isMirrored = !player.isMirrored;
		activeDialog = third;
	});

	third.setCallback(() => {
		player.isMirrored = !player.isMirrored;
		activeDialog = fourth;
	});

	fourth.setCallback(() => {
		child.follow(player);
	});
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

			let cryTrigger = new Collidable(825, 375, 10, 250);
			let nextLevelTrigger = new Collidable(1000, 375, 10, 250);

			physicsHandler.addCollidable(cryTrigger);
			physicsHandler.addCollidable(nextLevelTrigger);

			cryTrigger.onCollide = function() {

				activeDialog = new Dialog("WAAAAAAH!", 1, 100, 7);
				activeDialog.setPos(windowWidth - activeDialog.width - 25, windowHeight/2);
				activeDialog.isUiLevel = true;

				physicsHandler.removeCollidable(cryTrigger);
				camera.shake(5, 1000);
			};

			nextLevelTrigger.onCollide = function() {
				changeLevel();
				physicsHandler.removeCollidable(nextLevelTrigger);
			};

			stage.loadMap(levels[currentLevel]);
			break;

		case 1:
			player.setPos(100, 500);
			stage.loadMap(levels[currentLevel]);

			child = new Child(spriteHandler.getImage('child-sobbing'), 0.125);
			child.setPos(600, 501);

			let lookAtChildTrigger = new Collidable(300, 375, 10, 250);
			physicsHandler.addCollidable(child);
			physicsHandler.addCollidable(lookAtChildTrigger);

			lookAtChildTrigger.onCollide = function() {

				physicsHandler.removeCollidable(lookAtChildTrigger);

				player.canMove = false;
				camera.setTarget(undefined);
				camera.glideTo(createVector(child.pos.x, child.pos.y), 500, 500,callback => {
				// camera.glideTo(createVector(child.pos.x, child.pos.y), 2000, 2000,callback => {
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
