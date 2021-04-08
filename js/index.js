
const gameMusic = new Audio();
gameMusic.src = "./sounds/loveIsTheClass.mp3"
gameMusic.volume = 0.1;

const gameOverSound = new Audio();
gameOverSound.src = "./sounds/gameOverSound.ogg";
gameOverSound.volume = 0.1;

const container = document.querySelector(".container");
const reloadButton = document.getElementById("resetButton");


const canvas = document.getElementById("canvas-board");
const ctx = canvas.getContext("2d");

//instanciando as imagens
const bgImg = new Image();
bgImg.src = "./images/amsterdam_canal3.png";

const boatPlayer = new Image();
boatPlayer.src = "./images/boat_player2.png";

const boatObstacle = new Image();
boatObstacle.src = "./images/boat_obstacle.png";

const boatObstacleBlue = new Image();
boatObstacleBlue.src = "./images/boat_obstacle2.png"

const bather = new Image();
bather.src = "./images/bather.png";


const swan = new Image();
swan.src = "./images/swan.png";


const sup = new Image();
sup.src = "./images/sup.png";


//   const boatobstacle = new GameObject(canvas.width, canvas.height, 150, 60, obstacle1)


class GameObject {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.speedX = 0;
    this.speedY = 0;
  }

  updatePosition() {
    this.y += this.speedY;

    if (this.y <= this.height + 210) {
      this.y = this.height + 210;
    }

    if (this.y >= canvas.height - (this.height)) {
      this.y = canvas.height - (this.height);
    }

    this.x += this.speedX;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedX = - 4;
  }

  updatePosition() {
    this.x += this.speedX;
    this.x %= canvas.width;
  }

  draw() {
    ctx.drawImage(this.img, this.x, 0, this.width, this.height);
    ctx.drawImage(this.img, this.x + canvas.width, 0, this.width, this.height);
  }

}

class Game {
  constructor(background, player) {
    this.background = background;
    this.player = player;
    this.frames = 0;
    this.score = 0;
    this.animationID;
    this.obstacles = [];
    this.obstaclesImages = [boatObstacle, boatObstacleBlue, bather, swan, sup]
  }

  start = () => {
    this.updateGame();
  };

  updateGame = () => {
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition();
    this.player.draw();

    this.updateObstacles();

    this.updateScore();

    this.animationID = requestAnimationFrame(this.updateGame);

    this.checkGameOver();
  };

  updateObstacles = () => {
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) {
     this.obstacles[i].speedX = - 5;
        this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
    }

    if (this.frames % 100 === 0) {
      const randomObstacle = Math.floor(Math.random() * this.obstaclesImages.length)
      
        const originX = 750;

      const minY = 300;
      const maxY = 580;
      const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      const imageRandom =  this.obstaclesImages[randomObstacle]
      const obstacle = new GameObject(
        originX,
        randomY,
        imageRandom.width,
        imageRandom.height,
        imageRandom
      );
      this.obstacles.push(obstacle);

      this.score++
    }
  };

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      return this.player.crashWith(obstacle);
    });

    if (crashed) {
     gameMusic.pause()
     gameOverSound.play()

      cancelAnimationFrame(this.animationID);

      this.gameOver();
    }
  };

  updateScore() {
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.score}`, 50, 40);
  }

  gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffc68c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#9b5b4a";
    ctx.font = "bold 60px Verdana";
    ctx.fillText("Game Over!", canvas.width / 3.8, 230);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Your Final Score: ${this.score}`, canvas.width / 3.2, 350);

    reloadButton.style.display = "flex";
  }

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  
    const backgroundImage = new BackgroundImage(
        0,
        0,
        canvas.width,
        canvas.height,
        bgImg
      );

const player = new GameObject(canvas.width - 780, 390, boatPlayer.width, boatPlayer.height, boatPlayer);
const game = new Game(backgroundImage, player, boatObstacle);

  game.start();

  //definindo setas para cima e para baixo como teclas para movimentar o barco
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
      game.player.speedY = -3;
    } else if (event.code === "ArrowDown") {
      game.player.speedY = 3;
    }
  });

  //freiando o barco quando as teclas setas para cima e para baixo não estão pressionadas
  document.addEventListener("keyup", () => {
    game.player.speedY = 0;
  });
}

//carregando o jogo e iniciando com o botão start
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    container.style.display = "none";
    gameMusic.play();
    startGame();

  };



  reloadButton.onclick = () => {
    document.location.reload(true);
  }
 };




