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
let obstacles;
let player1;
let hole;
let arrow = null;
let inputPressed = false;
let currentLevel = 1

function preload () {
  this.load.image('grass', 'assets/grass.png');
  this.load.image('wooden_v', 'assets/wooden_v.png');
  this.load.image('wooden_h', 'assets/wooden_h.png');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('hole', 'assets/hole.png');

  // Load JSON file
  this.load.json('levels', 'assets/levels.json');

}
function loadLevel(levelNumber) {
  // Get obstacles data for the current level
  const obstaclesData = levelData[(levelNumber - 1)%3].obstacles;
  const holeData = levelData[(levelNumber - 1)%3].hole
  // Create obstacles
  obstaclesData.forEach(obstacle => {
      obstacles.create(obstacle.x, obstacle.y, obstacle.type)
          .setScale(obstacle.scaleX, obstacle.scaleY)
          .refreshBody();
  });
  hole = this.physics.add.image(holeData.x,holeData.y,holeData.type).setScale(holeData.scale)
  // Initialize player and hole
  // This part remains the same as before
  // Init player.
  player1 = this.physics.add.image(400, 100, 'ball').setScale(0.015);
  // Set player physics.
  player1.setBounce(0.4);
  player1.body.linearDamping = 1.0;
  this.physics.add.collider(player1, obstacles);

  // Init hole & set overlap with player.
  
  this.physics.add.overlap(player1, hole, scored, null, this);

  // /** If you want to test physics of the ball and obastacles, uncomment below lines **/
  // player1.setVelocity(1000, 750);
  // let hole2 = this.physics.add.image(700, 520, 'hole').setScale(0.35);
  // this.physics.add.overlap(player1, hole2, scored, null, this); 

}

function create () {

  // Load background.
  background = this.add.image(400, 300, 'grass');
  background.setScale(1.6, 1.2);
  
  /************************** Boundary ****************************/
  obstacles = this.physics.add.staticGroup();

  // top horizontal
  obstacles.create(18, 18, 'wooden_v').setScale(3.1, 0.07).refreshBody();
  // left vertical
  obstacles.create(18, 18, 'wooden_h').setScale(0.07, 3.1).refreshBody();
  // bottom horizontal
  obstacles.create(782, 582, 'wooden_v').setScale(3.1, 0.07).refreshBody();
  // right vertical
  obstacles.create(782, 582, 'wooden_h').setScale(0.07, 3.1).refreshBody();

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
  
  levelData = this.cache.json.get('levels');
  loadLevel.call(this, currentLevel);


}

function update () {

}

// If player collide with hole, dissapear.
function scored(player, hole) {
  player.disableBody(true, true);
  loadLevel.call(this,currentLevel+1)
}