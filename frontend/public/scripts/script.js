import { updateInstance, getInstance,updatePlayerControlbyId,getPlayerControlbyId,getAllPlayerControl,createPlayerControl, getTick, fetchTime } from "./api.js";

import { BACKEND_URL } from "./config.js";

const params = new URLSearchParams(window.location.search);
const roomId = params.get("roomId");
const userId = params.get("userId");

let game, lastFetchTime, fetchInterval;
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
        debug: true,
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
  lastFetchTime = 0;
  fetchInterval = 5000; // Fetch data every 5 seconds
}

let background;
let boundary;
let obstacles;
let levelData;
let myPlayer;
let players = {};
let turnIndex = new Array(4);
let hole;
let arrow = null;
let mode = 3;
let currentLevel = 1;
let angle;
let power;
let downTime;
let inputPressed;
let currentPlayerIdx = 0; // index
let inHole = 0;
let countdownInterval;
let countdownText;
let screenText;
let countdownValue;
let playerNumber = 4;
let scene;
let currentTick;
let lastTick;
let nextState = false ;
let currentTime = 0;
let lastTime = 0

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

  // Load obstacles JSON
  this.load.json("levels", "../assets/levels.json");
  scene = this;
}

function loadLevel(levelNumber) {
  // Destroy previous arrow and hole
  if (arrow) {
    arrow.destroy();
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
  hole.setSize(hole.width * 0.2, hole.height * 0.2);

  fetchLastTick();
  // Init all players
  initAllPlayers.call(this).then(() => {
    turnIndex.forEach(id => {
      this.physics.add.overlap(players[id], hole, scored, null, this);
    });
    setMode.call(this, 1);
    console.log("create");
  });

  countdownText = this.add.text(125, 18, "", {
    fontSize: "30px",
    color: "#ffffff",
  });
  screenText = this.add.text(650, 18, "", {
    fontSize: "35px",
    color: "#ffffff",
  });
  screenText.setOrigin(0.5);
  countdownText.setOrigin(0.5);
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
    player.disableBody(true, true);
    arrow.destroy();
    mode = 
    inHole++;
    if (inHole == 4){
      // Stop timer
      countdownText.setText("");
      screenText.setText("");
      hole.disableBody(true, true);
      currentLevel++;
      loadLevel.call(this, currentLevel);
    }
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
    // set ball velocity to 0
    console.log(myPlayer)
    myPlayer.setVelocity(0, 0);

    createArrow.call(this);

    getInstance(roomId, userId).then((response) => {
      const data = response.data;
      //console.log(data)
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
    //mode when ball fall in ahole
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

function checkStop() {
  return players[turnIndex[0]].body.velocity.length() < 10 &&
  players[turnIndex[1]].body.velocity.length() < 10 &&
  players[turnIndex[2]].body.velocity.length() < 10 &&
  players[turnIndex[3]].body.velocity.length() < 10 
}

function update() {
  fetchCurTick();
  console.log(mode)
  //console.log(currentTick);
  if (turnIndex[0] === userId){
    if (2 - (currentTick - lastTick)/1000 <= 0) {
      updatePlayerControlbyId(userId, {
        angle: 0, // Send the angle data
        power: 0, // Send the power data
        currentMap : currentLevel,
        status : "not_swing",
        signal : "ready",
        currentTime: currentTick,
        lastTime: lastTick
      });
    }
    if (mode === 0) {

      // if the ball is moving, ball should not be able to be controlled
      this.input.off("pointermove");
      this.input.off("pointerdown");
      this.input.off("pointerup");
      // check if the ball is moving so slow that we can make it stop completely and change the mode
      if (checkStop() && (currentTick - lastTick)/1000 >= 2) {
        updatePlayerControlbyId(userId, {
          angle: 0, // Send the angle data
          power: 0, // Send the power data
          currentMap : currentLevel,
          status : "not_swing",
          signal : "ready"
        });
        angle = 0 ;
        power = 0 ;
  
        setMode.call(this, 1);
      }
    } else if (mode === 1) {
      
      countdownText.setText('Time left:' + Math.round(10 - (currentTick - lastTick)/1000))
      screenText.setText("Stanby Phase")
      if (10 - (currentTick - lastTick)/1000 <= 0) {
        screenText.setText('Action Phase!')
        countdownText.setText('')
        fetchLastTick();
        //change to next mode
        updatePlayerControlbyId(userId, {
          angle: angle, // Send the angle data
          power: power, // Send the power data
          currentMap : currentLevel,
          status : "swing",
          signal : "ready"
        });
        setMode.call(this, 2)
      } else {
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
        } else if (downTime !== 0 && myPlayer.body && myPlayer.body.velocity) {
          this.input.enabled = false ;
          this.input.off("pointermove");
          this.input.off("pointerdown");
          this.input.off("pointerup");
          arrow.setVisible(false) ; 
          power = powerCalc.call(this) * 1.5;
          updatePlayerControlbyId(userId, {
            angle: angle, // Send the angle data
            power: power, // Send the power data
            currentMap : currentLevel,
            status : "swing",
            signal : "not_ready"
          });
          downTime = 0;
        }
      }
    } else if (mode === 2) {
      
      //when score is called
      turnIndex.forEach(id => {
        inputOtherPlayer.call(this,id)
      });
      updatePlayerControlbyId(userId, {
        angle: angle, // Send the angle data
        power: power, // Send the power data
        currentMap : currentLevel,
        status : "swing",
        signal : "not_ready"
      });
      setMode.call(this, 0);
    }
  }else{
    if (0.5 - (currentTick - lastTick)/1000 <= 0) {
      updateTime(turnIndex[0]) ;
    }
    if (mode === 0) {
      // if the ball is moving, ball should not be able to be controlled
      this.input.off("pointermove");
      this.input.off("pointerdown");
      this.input.off("pointerup");
      // check if the ball is moving so slow that we can make it stop completely and change the mode
      if (checkStop() && (currentTime - lastTime)/1000 >= 2) {
        updatePlayerControlbyId(userId, {
          angle: 0, // Send the angle data
          power: 0, // Send the power data
          currentMap : currentLevel,
          status : "not_swing"
        });
        angle = 0 ;
        power = 0 ;
        
        fetchLastTick();
        this.input.enabled = true;

        nextState = true ;
        setMode.call(this, 1);
      }
    } else if (mode === 1) {

      countdownText.setText('Time left:' + Math.round(10 - (currentTime - lastTime)/1000))
      screenText.setText("Stanby Phase")
      if (10 - (currentTime - lastTime)/1000 <= 0) {
        screenText.setText('Action Phase!')
        countdownText.setText('')
        fetchLastTick();
        //change to next mode
        setMode.call(this, 2)
      } else {
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
        } else if (downTime !== 0 && myPlayer.body && myPlayer.body.velocity) {
          this.input.enabled = false ;
          this.input.off("pointermove") ;
          this.input.off("pointerdown") ;
          this.input.off("pointerup") ;
          arrow.setVisible(false) ; 
          power = powerCalc.call(this) * 1.5;
          updatePlayerControlbyId(userId, {
            angle: angle, // Send the angle data
            power: power, // Send the power data
            currentMap : currentLevel,
            status : "swing"
          });
          
          downTime = 0;
        } 
      }
    } else if (mode === 2) {
      //when score is called
      turnIndex.forEach(id => {
        inputOtherPlayer.call(this,id)
      });
      setMode.call(this, 0);
    }
  }
  
}

function fetchCurTick() {
  // Fetch the current server time and set it to currentTick
  getTick().then((serverTime) => {
    currentTick = serverTime;
  })
}

function fetchLastTick() {
  getTick().then((serverTime) => {
    lastTick = serverTime;
  })
}

// async function checkNextState(id){
//   const response = await fetch(
//     `${BACKEND_URL}/api/playerControl/getPlayerById?playerId=${id}`
//   ).then((r) => r.json());
//   const data = response.data ;
//   const signal = data.signal ;
//   if (signal === "ready"){
//       return true ; 
//   }
//   return false ;
// }

async function updateTime(id) {
  //setInterval(async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/playerControl/getPlayerById?playerId=${id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }
  
      const data = await response.json();
      const curtime = data.currentTime;
      const lasttime = data.lastTime;
      console.log(currentTime)
      console.log(curtime)
      currentTime = curtime;
      lastTime = lsatime
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
 // }, 2000);
}

async function checkNextState(id) {
  //setInterval(async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/playerControl/getPlayerById?playerId=${id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }
  
      const data = await response.json();
      const signal = data.signal;
      
      if (signal === "ready") {
        console.log('Player is ready!');
        // You can perform additional actions here when the player is ready
      } else {
        console.log('Player is not ready yet.');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
 // }, 2000);
}

async function inputOtherPlayer(id) {
 
  const response = await fetch(
    `${BACKEND_URL}/api/playerControl/getPlayerById?playerId=${id}`
  ).then((r) => r.json());
  const data = response.data ;

  const power = data.power;
  const angle = data.angle;
  this.physics.velocityFromRotation(angle, power, players[id].body.velocity);
  
}


async function initAllPlayers() {
  const response = await fetch(`${BACKEND_URL}/api/room/${roomId}`);
  const data = await response.json();
  let idx = 0;

  data.data.Instance.map((instance, index) => {
    if (instance.player !== userId) {
      if (players[instance.player]) {
        players[instance.player].destroy();
      }
      let player = this.physics.add
        .image(
          instance.current_position.posX,
          instance.current_position.posY,
          `ball${index + 1}`
        )
        .setScale(0.015);
      player.setBounce(0.5);
      player.setDamping(true);
      player.setDrag(0.65);
      this.physics.add.collider(player, obstacles);
      this.physics.add.collider(player, boundary);
      this.physics.add.collider(player, myPlayer);
      players[instance.player] = player;
      turnIndex[idx] = instance.player;
      idx++;
    } else {
      if (myPlayer) {
        myPlayer.destroy();
      }
      myPlayer = this.physics.add
        .image(instance.current_position.posX, instance.current_position.posY, `ball${index + 1}`)
        .setScale(0.015);
      myPlayer.setBounce(0.5);
      myPlayer.setDamping(true);
      myPlayer.setDrag(0.65);
      myPlayer.setDepth(1);
      this.physics.add.collider(myPlayer, obstacles);
      this.physics.add.collider(myPlayer, boundary);
      players[userId] = myPlayer;
      turnIndex[idx] = userId;
      idx++;
    }
  });

  

  // Add colliders between all players
  for (const playerId1 in players) {
    for (const playerId2 in players) {
      if (playerId1 !== playerId2) {
        this.physics.add.collider(players[playerId1], players[playerId2]);
      }
    }
  }
  // Resolve the promise to indicate that initialization is complete
  return Promise.resolve();
}

