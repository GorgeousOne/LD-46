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
let nextLevelTrigger;

let mapLeaveBlock;
let levelNotFinishedBlock;
let campfire;

let isEvening = false;
let isNight = false;
let nightShadow;

let talkingMonster;
let monsterWave;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');

	spriteHandler.loadImage('buddy','assets/buddy.png');
	spriteHandler.loadImage('fighter-buddy','assets/fighter-buddy.png');
	spriteHandler.loadImage('child','assets/child.png');
	spriteHandler.loadImage('child-sobbing','assets/child-sobbing.png');

	spriteHandler.loadImage('path', 'assets/path.png');
	spriteHandler.loadImage('forest', 'assets/forest-tiles.png');

	spriteHandler.loadImage('campfire','assets/campfire.png');
	spriteHandler.loadImage('campfire-lit','assets/campfire-lit.png');
	spriteHandler.loadImage('monster','assets/monster.png');

	levels = [];
	levels.push(loadStrings('levels/level1.txt'));
	levels.push(loadStrings('levels/level2.txt'));
	levels.push(loadStrings('levels/level3.txt'));
}

function setup() {

	createCanvas(windowWidth, windowHeight, P2D);
	fullscreen();
	smooth();

	loadLetters(spriteHandler.getImage('font'));
	physicsHandler = new PhysicsHandler();

	player = new Player(spriteHandler.getImage('buddy'), 0.125);
	physicsHandler.addCollidable(player);

	camera = new Camera();
	camera.setTarget(player, true, true);
	camera.zoom = Math.max(windowWidth, windowHeight) / 640;

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

	mapLeaveBlock = new Collidable(-10, 375, 10, 250);
	nextLevelTrigger = new Collidable(1000, 375, 10, 250);
	nextLevelTrigger.onCollide = function() {
		changeLevel();
	};

	physicsHandler.addCollidable(mapLeaveBlock);
	physicsHandler.addCollidable(nextLevelTrigger);

	createNightImg();
	changeLevel();
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
	if(campfire) campfire.display();
	if(child) child.display();
	player.display();


	if(activeDialog && !activeDialog.isUiLevel && !isNight)
		activeDialog.display();

	pop();

	if(isEvening) {
		fill(0, 0, 20, 128);
		rect(0, 0, width, height);

	}else if(isNight) {
		// image(nightShadow, 0, 0);

		if(talkingMonster) {
			push();
			camera.focus();
			talkingMonster.display();
			pop();
		}

		if(monsterWave) {
			monsterWave.run();

			push();
			camera.focus();
			monsterWave.monsters.forEach(monster => monster.display());
			pop();
		}

	}

	if(activeDialog && !activeDialog.isUiLevel && isNight) {
		push();
		camera.focus();
		noSmooth();
		activeDialog.display();
		pop();
	}


	ellipse(windowWidth/2, windowHeight/2, 4,4 );

	if(activeDialog && activeDialog.isUiLevel)
		activeDialog.display();
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

let talkedToChild = false;
let talkedToCampfire = false;

function keyPressed() {

	if (key !== 'e' && keyCode !== ENTER && key !== ' ')
		return;

	if (activeDialog) {
		activeDialog.loadNextBubble();

		if(activeDialog.hasEnded) {
			activeDialog = undefined;
		}
		return;
	}

	if (child && !talkedToChild && player.pos.dist(child.pos) < player.width*2) {
		talkTolChild();
		talkedToChild = true;

	}else if(campfire && !talkedToCampfire && player.pos.dist(campfire.pos) < player.width*2) {
		talkAboutFire();
		talkedToCampfire = true;
	}
}

function talkTolChild() {

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
		physicsHandler.removeCollidable(levelNotFinishedBlock);
	});
}

function talkAboutFire() {

	player.isMirrored = player.pos.x > campfire.pos.x;

	activeDialog = new Dialog('Oh, a fire place! With some wood we can make a fire for the night here!', 2,  150);
	let second = new Dialog('I have no time to code this!', 2, 150);

	activeDialog.placeAboveHead(player);
	second.placeAboveHead(player);

	activeDialog.setCallback(() => {
		activeDialog = second;
	});

	second.setCallback(() => {
		startNight();
	});
}

function startNight() {

	campfire.texture = spriteHandler.getImage('campfire-lit');

	player.setPos(campfire.pos.x - player.width, campfire.pos.y - campfire.height/2);
	child.setPos(campfire.pos.x + campfire.width, campfire.pos.y - campfire.height/2);

	player.isMirrored = false;
	child.isMirrored = true;
	child.lead = undefined;
	physicsHandler.addCollidable(child);

	camera.setTarget(campfire, true, true);
	isEvening = false;
	isNight = true;

	player.texture = spriteHandler.getImage('fighter-buddy');
	player.canMove = false;

	let buddyQuestion = new Dialog('Who is there? What do you want?', 2, 150);
	buddyQuestion.placeAboveHead(player);

	let monsterTalk = new Dialog('WE WANT THE CHILD!', 2, 150, 2);
	monsterTalk.textColor = color(128, 0, 0);

	talkingMonster = new Monster(spriteHandler.getImage('monster'), 0.125);
	talkingMonster.setPos(0, campfire.pos.y);

	talkingMonster.moveTo(player.pos.copy().sub(2*player.width, 0), 3000, () => {
		//1. move towards the player and let him ask
		player.isMirrored = true;
		activeDialog = buddyQuestion;
	});

	buddyQuestion.setCallback(() => {
		//2. let the monster answer
		monsterTalk.placeAboveHead(talkingMonster);
		activeDialog = monsterTalk;
		camera.shake(10, 1500);
	});

	monsterTalk.setCallback(() => {
		//3. start the wave of monsters
		player.canMove = true;
		speed = 1.75;

		monsterWave = new MonsterWave(10000, 2000, 2000, () => {
			console.log("OK its over");
		});

		physicsHandler.addCollidable(talkingMonster);
		monsterWave.monsters.push(talkingMonster);
		talkingMonster.moveTo(child.pos, 3000, () => {
			console.log("WE WON");
		});


		monsterWave.start();
		talkingMonster = undefined;
	});
}

function signum(f) {
	if (f > 0) return 1;
	if (f < 0) return -1;
	return 0;
}

function createNightImg() {

	let lightRadius = 250;

	nightShadow = createGraphics(width, height);
	nightShadow.background(0, 0, 10, 240);

	let canvasMid = createVector(width/2, height/2);

	for(let x = 0; x < width; x++) {
		for(let y = 0; y < width; y++) {

			let light = (canvasMid.dist(createVector(x, y)) / lightRadius);

			if(light < 1)
				nightShadow.set(x, y, color(0, 0, 10, light * 240));
		}
	}
	nightShadow.updatePixels();
}

function changeLevel() {

	currentLevel++;
	stage.loadMap(levels[currentLevel]);

	switch (currentLevel) {
		case 0:
			player.setPos(250, 750);

			let cryTrigger = new Collidable(825, 375, 10, 250);
			physicsHandler.addCollidable(cryTrigger);

			cryTrigger.onCollide = function() {

				activeDialog = new Dialog("WAAAAAAH!", 1, 100, 7);
				activeDialog.setPos(windowWidth - activeDialog.width - 25, windowHeight/2);
				activeDialog.isUiLevel = true;

				physicsHandler.removeCollidable(cryTrigger);
				camera.shake(5, 1000);
			};

			break;

		case 1:
			child = new Child(spriteHandler.getImage('child-sobbing'), 0.125);

			player.setPos(100, 500);
			child.setPos(600, 501);

			let lookAtChildTrigger = new Collidable(300, 375, 10, 250);
			levelNotFinishedBlock = new Collidable(925, 375, 10, 250);

			physicsHandler.addCollidable(child);
			physicsHandler.addCollidable(lookAtChildTrigger);
			physicsHandler.addCollidable(levelNotFinishedBlock);

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

		case 2:

			campfire = new Campfire(spriteHandler.getImage('campfire'), 0.125);
			campfire.setPos(600, 500);

			mapLeaveBlock.setPos(-10, 175);
			nextLevelTrigger.setPos(1000, 575);
			levelNotFinishedBlock.setPos(925, 575);

			physicsHandler.addCollidable(campfire);
			physicsHandler.addCollidable(levelNotFinishedBlock);

			player.setPos(100, 300);
			child.setPos(player.pos.x, player.pos.y);
			child.leadPoints = [];

			isEvening = true;
			activeDialog = new Dialog('Mhh It\'s getting late already', 2, 150);
			activeDialog.placeAboveHead(player);

			break;

		default:
			console.log("what level is this?");
			break;
	}
}
