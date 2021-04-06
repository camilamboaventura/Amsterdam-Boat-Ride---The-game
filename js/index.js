const canvas = document.getElementById("canvas-board");
const ctx = canvas.getContext("2d");

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

    if (this.y <= this.height + 160) {
      this.y = this.height + 160;
    }

    if (this.y >= canvas.height - (this.height - 10)) {
      this.y = canvas.height - (this.height - 10);
    }

    this.x += this.speedX;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedX = -2;
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
  constructor(background, player, boatObstacleImg) {
    this.background = background;
    this.player = player;
    this.boatObstacleImg = boatObstacleImg;
    this.frames = 0;
    this.animationID;
    this.obstacles = [];
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

    this.animationID = requestAnimationFrame(this.updateGame);
  };

  updateObstacles = () => {
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
    }

    if (this.frames % 240 === 0) {
      const originX = 500;

      const minY = 300;
      const maxY = 580;
      const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      const obstacle = new GameObject(
        originX,
        randomY,
        150,
        60,
        this.boatObstacleImg
      );
      this.obstacles.push(obstacle);
    }
  };

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  //instanciando as imagens
  const bgImg = new Image();
  bgImg.src = "./images/amsterdam_canal3.png";

  const boatPlayer = new Image();
  boatPlayer.src = "./images/boat_player2.png";

  const boatObstacle = new Image();
  boatObstacle.src = "./images/boat_obstacle.png";

  const backgroundImage = new BackgroundImage(
    0,
    0,
    canvas.width,
    canvas.height,
    bgImg
  );

  //   const boatobstacle = new GameObject(canvas.width, canvas.height, 150, 60, obstacle1)
  const player = new GameObject(canvas.width - 780, 390, 170, 100, boatPlayer);
  const game = new Game(backgroundImage, player, boatObstacle);

  game.start();

  //definindo setas para cima e para baixo como teclas para movimentar o barco
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
      game.player.speedY = -2;
    } else if (event.code === "ArrowDown") {
      game.player.speedY = 2;
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
    startGame();
  };
};
