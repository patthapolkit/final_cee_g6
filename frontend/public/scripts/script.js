// Phaser Game
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let game;
let background;
let boundary;
let obstacles;
let player1;
let hole;
let arrow = null;
let mode = 1;
let currentLevel = 1;
let angle;
let power;
let downTime;
let inputPressed;

function preload() {
  this.load.image("grass", "../assets/grass.png");
  this.load.image("wooden_v", "../assets/wooden_v.png");
  this.load.image("wooden_h", "../assets/wooden_h.png");
  this.load.image("ball", "../assets/ball.png");
  this.load.image("hole", "../assets/hole.png");
  this.load.image("arrow", "../assets/arrow.png");

  // Load obstacles JSON
  this.load.json("levels", "../assets/levels.json");
}

function loadLevel(levelNumber) {
  // Destroy previous player and hole
  if (player1) {
    player1.destroy();
  }
  if (hole) {
    hole.destroy();
  }
  // Destroy previous obstacles
  obstacles.clear(true, true);
  // Get obstacles data for the current level
  const obstaclesData = levelData[(levelNumber - 1) % 3].obstacles;
  const holeData = levelData[(levelNumber - 1) % 3].hole;
  // Create obstacles
  obstaclesData.forEach((obstacle) => {
    obstacles
      .create(obstacle.x, obstacle.y, obstacle.type)
      .setScale(obstacle.scaleX, obstacle.scaleY)
      .refreshBody();
  });
  // Create hole
  hole = this.physics.add
    .image(holeData.x, holeData.y, holeData.type)
    .setScale(holeData.scale);

  // Create player
  player1 = this.physics.add.image(400, 400, "ball").setScale(0.015);
  // Set player physics properties
  player1.setBounce(0.5);
  player1.setDamping(true);
  player1.setDrag(0.65);
  this.physics.add.collider(player1, obstacles);
  this.physics.add.collider(player1, boundary);

  // Overlap with more than 90% of the hole
  hole.setSize(hole.width * 0.1, hole.height * 0.1);
  this.physics.add.overlap(player1, hole, scored, null, this);

  setMode.call(this, 1);
}

function create() {
  // Load background.
  background = this.add.image(400, 300, "grass");
  background.setScale(1.6, 1.2);

  levelData = this.cache.json.get("levels");
  obstacles = this.physics.add.staticGroup();

  // Create boundary
  boundary = this.physics.add.staticGroup();
  boundary.create(18, 18, "wooden_v").setScale(3.1, 0.07).refreshBody(); // top horizontal
  boundary.create(18, 18, "wooden_h").setScale(0.07, 3.1).refreshBody(); // left vertical
  boundary.create(782, 582, "wooden_v").setScale(3.1, 0.07).refreshBody(); // bottom horizontal
  boundary.create(782, 582, "wooden_h").setScale(0.07, 3.1).refreshBody(); // right vertical

  loadLevel.call(this, currentLevel);

  inputPressed = false;
  downTime = 0;
}

function scored(player, hole) {
  // Check if the player is moving slow enough to enter the hole
  if (player.body.velocity.length() <= 250) {
    player.disableBody(true, true);
    hole.disableBody(true, true);
    currentLevel++;
    loadLevel.call(this, currentLevel);
  }
}

function powerCalc() {
  return Math.abs(((this.time.now - downTime + 500) % 1000) - 500);
}

function setMode(newMode) {
  mode = newMode;
  if (newMode === 0) {
    if (arrow) {
      arrow.destroy();
    }
  } else if (newMode === 1) {
    createArrow.call(this);
  }
}

function createArrow() {
  arrow = this.add.image(player1.x, player1.y, "arrow").setScale(0.15, 0.15);
  arrow.setOrigin(0, 0.5);
}

function update() {
  if (mode === 0) {
    // if the ball is moving, ball should not be able to be controlled
    this.input.off("pointermove");
    this.input.off("pointerdown");
    this.input.off("pointerup");

    // check if the ball is moving so slow that we can make it stop completely and change the mode
    if (player1.body.velocity.length() < 10) {
      player1.setVelocity(0, 0);
      setMode.call(this, 1);
    }
  } else if (mode === 1) {
    this.input.on("pointermove", (pointer) => {
      angle = Phaser.Math.Angle.BetweenPoints(player1, pointer);
      arrow.rotation = angle;
      player1.rotation = angle;
    });
    this.input.on("pointerdown", (pointer) => {
      inputPressed = true;
    });
    this.input.on("pointerup", (pointer) => {
      inputPressed = false;
    });

    if (inputPressed) {
      if (downTime === 0) {
        downTime = this.time.now;
      } else {
        arrow.scaleX = 0.15 + (powerCalc.call(this) / 500) * 0.2;
      }
    } else if (downTime !== 0) {
      power = powerCalc.call(this) * 1.5;
      this.physics.velocityFromRotation(angle, power, player1.body.velocity);
      downTime = 0;
      setMode.call(this, 0);
    }
  }
}

game = new Phaser.Game(config);
