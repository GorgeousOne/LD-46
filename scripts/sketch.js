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

let house;

function preload() {

	spriteHandler = new SpriteHandler();
	spriteHandler.loadImage('font', 'scripts/dialog/pixel-font.min.png');

	spriteHandler.loadImage('buddy','assets/buddy.png');
	spriteHandler.loadImage('fighter-buddy','assets/fighter-buddy.png');
	spriteHandler.loadImage('child','assets/child.png');
	spriteHandler.loadImage('child-sobbing','assets/child-sobbing.png');
	spriteHandler.loadImage('child-side','assets/child-sidewards.png');
	spriteHandler.loadImage('child-hugging','assets/child-hugging.png');

	spriteHandler.loadImage('path', 'assets/path.png');
	spriteHandler.loadImage('forest', 'assets/forest-tiles.png');
	spriteHandler.loadImage('house','assets/house.png');

	spriteHandler.loadImage('campfire','assets/campfire.png');
	spriteHandler.loadImage('campfire-lit','assets/campfire-lit.png');
	spriteHandler.loadImage('monster','assets/monster.png');


	levels = [];
	levels.push(loadStrings('levels/level1.txt'));
	levels.push(loadStrings('levels/level2.txt'));
	levels.push(loadStrings('levels/level3.txt'));
	levels.push(loadStrings('levels/level4.txt'));
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
	nextLevelTrigger.onCollide = function(otherCollidable) {
		if(otherCollidable === player)
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
	// physicsHandler.collidables.forEach(collidable => collidable.hitbox.display());

	smooth();
	if(campfire) campfire.display();

	if(currentLevel === 3) {
		player.display();
		child.display();
		house.display();
	}else {
		if(child) child.display();
		player.display();
	}

	if(talkingMonster) {
		talkingMonster.display();

	}else if(monsterWave) {
		monsterWave.run();
		monsterWave.monsters.forEach(monster => monster.display());
	}

	if(activeDialog && !activeDialog.isUiLevel && !isNight)
		activeDialog.display();

	pop();

	if(isEvening) {
		fill(0, 0, 20, 128);
		rect(0, 0, width, height);

	}else if(isNight) {
		image(nightShadow, 0, 0);
	}

	if(activeDialog && !activeDialog.isUiLevel && isNight) {
		push();
		camera.focus();
		noSmooth();
		activeDialog.display();
		pop();
	}

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
		child.setTexture(spriteHandler.getImage('child'));
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

	isEvening = false;
	isNight = true;

	campfire.texture = spriteHandler.getImage('campfire-lit');
	camera.setTarget(campfire, true, true);

	player.setPos(550 - campfire.width, 390);
	child.setPos(550 + campfire.width, 390);

	player.isMirrored = false;
	child.isMirrored = true;
	child.lead = undefined;
	physicsHandler.addCollidable(child);

	child.setTexture(spriteHandler.getImage('child-side'));
	player.texture = spriteHandler.getImage('fighter-buddy');
	player.canMove = false;

	let buddyQuestion = new Dialog('Who is there? What do you want?', 2, 150);
	buddyQuestion.placeAboveHead(player);

	let monsterTalk = new Dialog('WE WANT THE CHILD!', 2, 150, 2);
	monsterTalk.textColor = color(128, 0, 0);

	talkingMonster = new Monster(spriteHandler.getImage('monster'), 0.125);
	talkingMonster.setPos(0, campfire.pos.y);

	// talkingMonster.moveTo(player.pos.copy().sub(2*player.width, 0), 100, () => {
	talkingMonster.moveTo(player.pos.copy().sub(2*player.width, 0), 5000, () => {
		//1. move towards the player and let him ask
		player.isMirrored = true;
		activeDialog = buddyQuestion;
	});

	buddyQuestion.setCallback(() => {
		//2. let the monster answer
		monsterTalk.placeAboveHead(talkingMonster);
		activeDialog = monsterTalk;
		camera.shake(5, 1500);
	});

	let winMessage = new Dialog("Phew, That was close!", 2, 150);

	// monsterWave = new MonsterWave(0, 1500, 680, () => {
	monsterWave = new MonsterWave(120000, 2000, 500, () => {
		isNight = false;

		activeDialog = winMessage;
		winMessage.placeAboveHead(player);

		player.texture = spriteHandler.getImage('buddy');
		camera.setTarget(player, true, true);
		child.setPos(player.pos);
		child.follow(player);

		physicsHandler.removeCollidable(levelNotFinishedBlock);
		physicsHandler.removeCollidable(child);
	});

	monsterTalk.setCallback(() => {
		//3. start the wave of monsters
		player.canMove = true;
		child.setTexture(spriteHandler.getImage('child'));

		physicsHandler.addCollidable(talkingMonster);
		monsterWave.monsters.push(talkingMonster);

		talkingMonster.moveTo(child.pos, 3000, () => {
			resetNight();
		});

		monsterWave.start();
		talkingMonster = undefined;
	});
}

function resetNight() {

	monsterWave.monsters.forEach(monster => physicsHandler.removeCollidable(monster));
	monsterWave = undefined;

	let loseMessage =  new Dialog("The monsters got the child :(", 1, 600, 4);
	loseMessage.isUiLevel = true;
	loseMessage.setPos(
		width/2 - loseMessage.width/2,
		height/2 - loseMessage.height/2);

	loseMessage.setCallback(() => {
		startNight();
	});

	activeDialog = loseMessage;
}

function signum(f) {
	if (f > 0) return 1;
	if (f < 0) return -1;
	return 0;
}

function createNightImg() {

	nightShadow = createGraphics(width, height);
	nightShadow.background(0, 0, 10, 240);

	let lightRadius = height/2;
	let canvasMid = createVector(width/2, height/2);

	for(let x = 0; x < width; x++) {
		for(let y = 0; y < width; y++) {

			let light = canvasMid.dist(createVector(x, y)) / lightRadius;

			if(light < 1)
				nightShadow.set(x, y, color(0, 0, 10, sin(light * HALF_PI) * 240 + random(-2, 2)));
		}
	}
	nightShadow.updatePixels();
}

function changeLevel() {

	currentLevel++;
	stage.loadMap(levels[currentLevel]);

	switch (currentLevel) {
		case 0:
			player.setPos(400, 750);

			let cryTrigger = new Collidable(925, 375, 10, 250);
			physicsHandler.addCollidable(cryTrigger);

			cryTrigger.onCollide = function() {

				activeDialog = new Dialog("WAAAAAAH!", 1, 100, 3);
				activeDialog.setPos(windowWidth - activeDialog.width - 25, windowHeight/2);
				activeDialog.isUiLevel = true;

				physicsHandler.removeCollidable(cryTrigger);
				camera.shake(5, 1000);
			};

			break;

		case 1:
			child = new Child(spriteHandler.getImage('child-sobbing'), 0.125);

			player.setPos(100, 500);
			child.setPos(600, 500);

			let lookAtChildTrigger = new Collidable(300, 375, 10, 250);
			levelNotFinishedBlock = new Collidable(925, 375, 10, 250);

			physicsHandler.addCollidable(child);
			physicsHandler.addCollidable(lookAtChildTrigger);
			physicsHandler.addCollidable(levelNotFinishedBlock);

			lookAtChildTrigger.onCollide = function() {

				physicsHandler.removeCollidable(lookAtChildTrigger);

				player.canMove = false;
				camera.setTarget(undefined);
				camera.glideTo(createVector(child.pos.x, child.pos.y), 2000, 2000,callback => {
					camera.setTarget(player, true, true);
					player.canMove = true;
				});
			};

			break;

		case 2:

			campfire = new Campfire(spriteHandler.getImage('campfire'), 0.125);
			campfire.setPos(550, 400);

			mapLeaveBlock.setPos(-10, 175);
			nextLevelTrigger.setPos(900, 375);
			levelNotFinishedBlock.setPos(825, 375);

			physicsHandler.addCollidable(campfire);
			physicsHandler.addCollidable(levelNotFinishedBlock);

			player.setPos(100, 300);
			child.setPos(player.pos.x, player.pos.y);
			child.leadPoints = [];

			isEvening = true;
			activeDialog = new Dialog('Mhh, It\'s getting late already. Let\'s try to find a place for the night.', 2, 150);
			activeDialog.placeAboveHead(player);

			break;

		case 3:

			house = new House(createVector(600, 350), spriteHandler.getImage('house'), 0.5);

			mapLeaveBlock.setPos(-10, 875);
			physicsHandler.removeCollidable(nextLevelTrigger);
			physicsHandler.removeCollidable(campfire);
			campfire = undefined;


			player.setPos(100, 500);
			child.setPos(200, 550);
			player.isSolid = false;
			child.lead = undefined;

			let homeSweetHome = new Dialog('Oh, look. We weren\'t so far awy from your home all along.', 2, 150);
			let goodBye = new Dialog('I guess from here you will find your way. Good luck!', 2, 150);
			let theEnd = new Dialog('The End!', 2, 600, 10);

			theEnd.textColor = color(255, 150, 150);
			theEnd.isUiLevel = true;
			theEnd.setPos(
				width/2 - theEnd.width/2,
				height/2 - theEnd.height/2);

			let lookAtHouseTrigger = new Collidable(275, 375, 10, 250);
			physicsHandler.addCollidable(lookAtHouseTrigger);

			lookAtHouseTrigger.onCollide = function () {
				//1. talk about house
				player.canMove = false;
				homeSweetHome.placeAboveHead(player);
				activeDialog = homeSweetHome;
				physicsHandler.removeCollidable(lookAtHouseTrigger);
			};

			homeSweetHome.setCallback(() => {
				//2. look at house
				camera.target = undefined;
				camera.glideTo(house.pos, 2000, 2000, () => {

					camera.setTarget(child, true, true)
					child.setPos(player.pos.x + player.width, player.pos.y);
					child.isMirrored = true;

					activeDialog = goodBye;
					goodBye.placeAboveHead(player);
					activeDialog = goodBye;
				});
			});

			goodBye.setCallback(() => {
				//3. let the child hug you
				child.moveTo(player.pos.copy().add(3, 0), 250, () => {

					child.setTexture(spriteHandler.getImage('child-hugging'));
					//4. the child runs to the house
					camera.glideTo(player.pos, 0, 500, () => {

						child.isMirrored = false;
						child.setTexture(spriteHandler.getImage('child-side'));
						child.moveTo(house.pos, 2000, () => {
							activeDialog = theEnd;
						});
					});
				})
			});

			break;

		default:
			console.log("what level is this?");
			break;
	}
}
