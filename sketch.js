var PLAY = 1;
var END = 0;
var gameState = PLAY;
var backimg,bk;
var trex, trex_running, trex_collided;
var  invisibleGround,ground,groundimg;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","TREX2.png","TREX3.png");
  trex_collided = loadAnimation("TREXCOLLIDED.png");
  
  obstacle1 = loadImage("OBSTACLE1.png");
  obstacle2 = loadImage("OBSTACLE2.png");
  obstacle3 = loadImage("OBSTACLE3.png");
  obstacle4 = loadImage("OBSTACLE4.png");
  obstacle5 = loadImage("OBSTACLE5.png");
  obstacle6 = loadImage("OBSTACLE6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  groundimg=loadImage("ground2.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  backimg = loadImage("bk.png");
  groundimg = loadImage("bk.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(700,height-90,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  
  trex.scale = 0.8;
  ground = createSprite(width/2,height-500,width,2);
  ground.addImage("ground",groundimg);
  ground.depth=trex.depth-1;
  ground.x = width/2;
  ground.scale=2;

  
  gameOver = createSprite(width/2,height/2-20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+20);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.7;
  restart.scale = 0.7;
  
  invisibleGround = createSprite(width/2,height-60,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  
  camera.x = trex.x;
  camera.y = trex.y;

  //displaying score
 
  
  
  
  if(gameState === PLAY){
 ground.velocityX = -6;
    
  
    if (ground.x < width-550){
    ground.x =width-400;
   }

    gameOver.visible = false;
    restart.visible = false;
    
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    
    
   if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-180) {
      jumpSound.play( )
      trex.velocityY = -18;
       touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   if (gameState === END) {
     
       ground.velocityX=0,
    
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      
      trex.velocityY = 0
      if(mousePressedOver(restart) || touches.length>0) {
      reset();
        touches = [];
    }
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
     
     obstaclesGroup.setVelocityXEach(0);
         
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
  fill('black');
    textSize(20);
    text("Score: "+ score,width-200,200);
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach(); 
  score = 0;
  trex.changeAnimation("running", trex_running);
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-160,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 300;
    obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height);
    obstacle.debug=false;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

