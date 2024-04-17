var config = {
  type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let background;
let boundary;
let obstacles;
let player1;
let hole;
let arrow = null;
let mode = 1;
let currentLevel = 1;
let angle;
let power = 50;

function preload () {
  this.load.image('grass', 'assets/grass.png');
  this.load.image('wooden_v', 'assets/wooden_v.png');
  this.load.image('wooden_h', 'assets/wooden_h.png');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('hole', 'assets/hole.png');
  this.load.image('arrow', 'assets/arrow.png');

  // Load JSON file
  this.load.json('levels', 'assets/levels.json');
}

function loadLevel(levelNumber) {
  // Destroy previous obstacles
  obstacles.clear(true, true);
  // Get obstacles data for the current level
  const obstaclesData = levelData[(levelNumber - 1)%3].obstacles;
  const holeData = levelData[(levelNumber - 1)%3].hole
  // Create obstacles
  obstaclesData.forEach(obstacle => {
      obstacles.create(obstacle.x, obstacle.y, obstacle.type)
          .setScale(obstacle.scaleX, obstacle.scaleY)
          .refreshBody();
  });
  // Initialize player and hole
  // This part remains the same as before
  // Init player.
  player1 = this.physics.add.image(400, 400, 'ball').setScale(0.015);
  // Set player physics.
  player1.setBounce(0.5);
  player1.setDamping(true);
  player1.setDrag(0.65);
  this.physics.add.collider(player1, obstacles);
  this.physics.add.collider(player1, boundary);
  
  // Init hole & set overlap with player.
  hole = this.physics.add.image(holeData.x,holeData.y,holeData.type).setScale(holeData.scale)
  this.physics.add.overlap(player1, hole, scored, null, this);

  setMode.call(this, 1);
}

function create () {
  // Load background.
  background = this.add.image(400, 300, 'grass');
  background.setScale(1.6, 1.2);
  
  /************************** Boundary ****************************/
  obstacles = this.physics.add.staticGroup();
  boundary = this.physics.add.staticGroup();

  levelData = this.cache.json.get('levels');
  // Create boundary
  // top horizontal
  boundary.create(18, 18, 'wooden_v').setScale(3.1, 0.07).refreshBody();
  // left vertical
  boundary.create(18, 18, 'wooden_h').setScale(0.07, 3.1).refreshBody();
  // bottom horizontal
  boundary.create(782, 582, 'wooden_v').setScale(3.1, 0.07).refreshBody();
  // right vertical
  boundary.create(782, 582, 'wooden_h').setScale(0.07, 3.1).refreshBody();
  
  /************************** Boundary ****************************/
  
  // Other obstacles
  // horizontals
  // obstacles.create(18, 150, 'wooden_v').setScale(1.5, 0.07).refreshBody();
  // obstacles.create(450, 185, 'wooden_v').setScale(0.2, 0.07).refreshBody();
  // obstacles.create(680, 220, 'wooden_v').setScale(0.4, 0.07).refreshBody();
  // obstacles.create(600, 325, 'wooden_v').setScale(0.4, 0.07).refreshBody();
  
  // // verticals
  // obstacles.create(300, 500, 'wooden_h').setScale(0.07, 1).refreshBody();
  // obstacles.create(480, 271, 'wooden_h').setScale(0.07, 0.28).refreshBody();
  
  loadLevel.call(this, currentLevel);
}

function setMode(newMode) {
  mode = newMode;
  if (newMode === 0) { // If the ball is moving
    if (arrow) {
      arrow.destroy();
    }
  } else if (newMode === 1) { // If the ball is not moving
    createArrow.call(this);
  }
}

function createArrow() {
  arrow = this.add.image(player1.x, player1.y, 'arrow').setScale(0.15, 0.15);
  arrow.setOrigin(0, 0.5);
}

function update () {
  if (mode === 0) {
    console.log('mode 0');
    // if the ball is moving, ball should not rotate with pointermove
    this.input.off('pointermove');
    this.input.off('pointerdown');
    this.input.off('pointerup');

    // check if the ball is moving so slow that we can make it stop completly and change the mode
    if (player1.body.velocity.length() < 10) {
      player1.setVelocity(0, 0);
      setMode.call(this, 1);
    }

  } else if (mode === 1) {
    console.log('mode 1');
    this.input.on('pointermove', (pointer) => {
      angle = Phaser.Math.Angle.BetweenPoints(player1, pointer);
      arrow.rotation = angle;
      player1.rotation = angle;
      }
    );

    // when the pointer is down, increase the power
    this.input.on('pointerdown', (pointer) => {
      this.time.addEvent({
        loop: true,
        delay: 100,
        callback: () => {
          if (power >= 800) {
            power = 50;
          } else {
            power += 10;
          }
          // Scale X of the arrow to show the power
          arrow.setScale(0.15 + ((power / 800) * 0.15), 0.15);
        }
      });
    });
  
    // When the pointer is released, swing the ball
    this.input.on('pointerup', (pointer) => {
      this.time.removeAllEvents();
      this.physics.velocityFromRotation(angle, power, player1.body.velocity);
      setMode.call(this, 0);
    });
  }
}

// If player collide with hole, dissapear.
function scored(player, hole) {
  player.disableBody(true, true);
  currentLevel++;
  loadLevel.call(this,currentLevel);
}