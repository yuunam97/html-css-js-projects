let config = {
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,

    // physics engine for the game
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  // game variable to set up our game by passing in the config object: 
let game = new Phaser.Game(config);
var bird;
let hasLanded = false;
let cursors;
let hasBumped = false;

let isGameStarted = false;
let messageToPlayer;

// Working with background for the clone app using three functions: preload, create and update

// Bring in images for the application, such as the background, from the ASSETS folder:
function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

// Generate elements that will appear in the game (from images loaded in the preload)
function create () {
    
    // With setOrigin: Specify that we want the upper left corner of the background positioned at (0, 0).
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // making a call to the arcade physics system, applying physics simulation to the roads we create. 
    const roads = this.pythics.add.staticGroup();

    // Create a group of columns for the bird to fly through.
    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        // creating additional columns
        repeat: 1,
        setXY: { x: 200, y: 0, stepX: 300 }
    });

    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: { x: 350, y: 400, stepX: 300 },
      });
      
    // roads variable to create a static road object, with scaled 2x bigger than original.
    // refreshBody() to update the physics body size to match the new scale.
    const road = roads.create(400, 568, 'road').setScale(2).refreshBody()
    
    // Create the bird object and add physics to it.
    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2); // bird bounce after it collides with something
    bird.setCollideWorldBounds(true); // bird bumps the object

    // make sure overlap method comes before the collider method
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road); // making sure bird land on top the road

    // system to detect when the bird has hit the column
    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);

    // disallowing the bird to not go through the columns
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);
    
    // Create the response from input for the bird.
    cursors = this.input.keyboard.createCursorKeys();

    // instructions!
    messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });

    // instructions @ the bottom-center the screen:
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);

}


// Update the `bird` object in the game. (making the bird responsive to inputs like up arrow and 
// make it run continuously until user inputs another interactive inputs)
function update () {

    // if user presses the space key, and the game has not started, then the game will start
    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true;

        //change the instruction when the game starts!
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground';
    }

    // if the game hasn't started, the sprite doesn't move upwards.
    if (!isGameStarted) {
        bird.setVelocityY(-160);
    }

    // if we press up key, and the bird has not landed the bird will move up by 160 pixels
    if (cursors.up.isDown && !hasLanded && !hasBumped) {
        bird.setVelocityY(-160);
    }

    // making sure that the bird doesn't move right when the game has started
    if(isGameStarted && (!hasLanded || !hasBumped)) {
        bird.body.velocity.x = 50;
    } else {
        bird.body.velocity.x = 0;
    }
    
    if (hasLanded || hasBumped) {
        messageToPlayer.text = `Oh no! You crashed!`;
    }

    // Ending for the game!
    if (bird.x > 750) {
        bird.setVelocityY(40); // slowing down the speed at which the bird falls
        messageToPlayer.text = `Congrats! You won!`;
      } 
}
