
class MonsterWave {

	//spawn rates are intervals in ms
	constructor(duration, startInterval, endInterval, callback) {

		this.monsters = [];

		this.duration = duration;
		this.startInterval = startInterval;
		this.spawnIncrement = endInterval - startInterval;

		this.callback = callback;
		this.spawningEnded = false;
		this.allMonstersKilled = false;
	}

	start() {
		this.startTime = Date.now();
		this.lastSpawn = Date.now() - this.startInterval;
	}

	run() {
		if(this.allMonstersKilled)
			return;

		if(this.spawningEnded && !this.allMonstersKilled && this.monsters.length === 0) {
			this.callback();
			this.allMonstersKilled = true;
		}

		if(!startTime || this.spawningEnded)
			return;

		let timeSinceStart = Date.now() - this.startTime;

		if(timeSinceStart > this.duration) {
			this.spawningEnded = true;
			return;
		}

		let currentInterval = this.startInterval + (timeSinceStart / this.duration) * this.spawnIncrement;
		let timeSinceLastSpawn = Date.now() - this.lastSpawn;

		if(timeSinceLastSpawn > currentInterval) {
			this.spawnMonster();
			this.lastSpawn = Date.now();
		}
	}

	removeMonster(monster) {

		for(let i = 0; i < this.monsters.length; i++) {
			if (this.monsters[i] === monster) {
				this.monsters.splice(i, 1);
				return;
			}
		}
	}

	spawnMonster() {

		let newMonster = new Monster(spriteHandler.getImage('monster'), 0.125);
		physicsHandler.addCollidable(newMonster);

		let rndPos = this.getRndPos(350);

		newMonster.setPos(rndPos.x, rndPos.y);
		newMonster.moveTo(child.pos, 10000, () => {
			resetNight();
		});

		this.monsters.push(newMonster);
	}

	getRndPos(radius) {
		let rndYaw = random(-PI, PI);
		let rndVec = createVector(
			cos(rndYaw),
			sin(rndYaw)
		);

		rndVec.mult(radius);
		return child.pos.copy().add(rndVec);
	}
}