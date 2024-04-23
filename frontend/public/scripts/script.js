import {
  updateInstance,
  getInstance,
  updatePlayerControlbyId,
  getPlayerControlbyId,
  getRoomById,
} from "./api.js";

import { BACKEND_URL } from "./config.js";

const params = new URLSearchParams(window.location.search);
const roomId = params.get("roomId");
const userId = params.get("userId");

let game, fetchInterval;
if (!roomId) {
  alert("No room id provided.");
} else if (!userId) {
  alert("No player id provided.");
} else {
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

    scale: {
      mode: Phaser.Scale.FIT,
      parent: "game-container",
    },
  };
  game = new Phaser.Game(config);
  fetchInterval = 1000; // Fetch data every 1 seconds
}

let background;
let boundary;
let obstacles;
let levelData;
let myPlayer;
let players = {};
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
  this.load.image("ball1", "../assets/ball_black.png");
  this.load.image("ball2", "../assets/ball_blue.png");
  this.load.image("ball3", "../assets/ball_red.png");
  this.load.image("ball4", "../assets/ball_yellow.png");
  this.load.image("hole", "../assets/hole.png");
  this.load.image("arrow", "../assets/arrow.png");
  this.load.json("levels", "../assets/levels.json");
}

function loadLevel(levelNumber) {
  if (levelNumber > 3) {
    window.location.href = "/leaderboard.html";
  }
  // Destroy previous arrow and hole
  if (myPlayer) {
    myPlayer.destroy();
  }
  if (arrow) {
    arrow.destroy();
  }
  if (hole) {
    hole.destroy();
  }
  // Destroy previous obstacles
  obstacles.clear(true, true);
  // Get obstacles data for the current level
  const obstaclesData = levelData[(levelNumber - 1)].obstacles;
  const holeData = levelData[(levelNumber - 1)].hole;
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
  hole.setSize(hole.width * 0.2, hole.height * 0.2);

  // Init all players
  initAllPlayers.call(this).then(() => {
    this.physics.add.overlap(myPlayer, hole, scored, null, this);
    setMode.call(this, 1);
  });
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
  loadLevel.call(this, 1);
  inputPressed = false;
  downTime = 0;
}

function scored(player, hole) {
  // Check if the player is moving slow enough to enter the hole
  if (player.body.velocity.length() <= 250) {
    setMode.call(this, 2);
    player.disableBody(true, true);
    hole.disableBody(true, true);
    arrow.destroy();
    getInstance(roomId, userId).then((response) => {
      const data = response.data;
      updateInstance(roomId, {
        player: userId,
        current_swings: 0,
        total_swings: data.total_swings + 1,
        current_position: {
          posX: 100,
          posY: 100,
        },
      });
    });
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
    myPlayer.setVelocity(0, 0);
    createArrow.call(this);
    getInstance(roomId, userId).then((response) => {
      const data = response.data;
      updateInstance(roomId, {
        player: userId,
        current_swings: data.current_swings + 1,
        total_swings: data.total_swings + 1,
        current_position: {
          posX: myPlayer.x,
          posY: myPlayer.y,
        },
      });
    });
  } else if (newMode === 2) {
    if (arrow) {
      arrow.destroy();
    }
  }
}

function createArrow() {
  arrow = this.add.image(myPlayer.x, myPlayer.y, "arrow").setScale(0.15, 0.15);
  arrow.setOrigin(0, 0.5);
}

function update() {
  if (mode === 0) {
    // If the ball is moving, ball should not be able to be controlled
    this.input.off("pointermove");
    this.input.off("pointerdown");
    this.input.off("pointerup");
    // Check if the ball is moving so slow that we can make it stop completely and change the mode
    if (myPlayer.body.velocity.length() < 15) {
      setMode.call(this, 1);
    }
  } else if (mode === 1) {
    this.input.on("pointermove", (pointer) => {
      angle = Phaser.Math.Angle.BetweenPoints(myPlayer, pointer);
      arrow.rotation = angle;
      myPlayer.rotation = angle;
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
      this.physics.velocityFromRotation(angle, power, myPlayer.body.velocity);
      downTime = 0;
      setMode.call(this, 0);
    }
  } else if (mode === 2) {
    this.input.off("pointermove");
    this.input.off("pointerdown");
    this.input.off("pointerup");
  }

  if (currentLevel > 3) {
    window.location.href = "/leaderboard.html";
  }
}

async function initAllPlayers() {
  const response = await fetch(`${BACKEND_URL}/api/room/${roomId}`);
  const data = await response.json();

  data.data.Instance.map((instance, index) => {
    if (instance.player !== userId) {
      players[instance.player] = null;
    } else {
      if (myPlayer) {
        myPlayer.destroy();
      }
      myPlayer = this.physics.add
        .image(100, 100, `ball${index + 1}`)
        .setScale(0.015);
      myPlayer.setBounce(0.5);
      myPlayer.setDamping(true);
      myPlayer.setDrag(0.65);
      myPlayer.setDepth(1);
      this.physics.add.collider(myPlayer, obstacles);
      this.physics.add.collider(myPlayer, boundary);
      players[userId] = myPlayer;
    }
  });

  return Promise.resolve();
}
