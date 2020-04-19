
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
		this.lastSpawn = Date.now();
	}

	run() {
		if(this.allMonstersKilled)
			return;

		if(this.spawningEnded && !this.allMonstersKilled && this.monsters.length === 0) {
			console.log(this.monsters.length + " monsters left");
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

	spawnMonster() {

		let newMonster = new Monster(spriteHandler.getImage('monster'), 0.125);
		physicsHandler.addCollidable(newMonster);

		newMonster.setPos(600, 300);
		newMonster.moveTo(child.pos, 3000, () => {
			console.log("WE WON i am at " + newMonster.pos);
		});

		this.monsters.push(newMonster);
		console.log("spawn")
	}

	removeMonster(monster) {

		for(let i = 0; i < this.monsters.length; i++) {
			if (this.monsters[i] === monster) {
				this.monsters.splice(i, 1);
				return;
			}
		}
	}
}