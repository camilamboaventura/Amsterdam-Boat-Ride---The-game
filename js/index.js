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

  updatePosition() {}

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  draw() {
    ctx.drawImage(this.img, this.x, 0, this.width, this.height);
  }
}

class Game {
  constructor(background, player) {
    this.background = background;
    this.player = player;
  }

  start = () => {
    this.updateGame();
  };

  updateGame = () => {
    //this.clear();

    this.background.draw();
  };

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  const bgImg = new Image();
  bgImg.src = "./images/amsterdam_canal.png";

  const boatPlayer = new Image();
  boatPlayer.src = "./images/boat_player.png";

  const backgroundImage = new BackgroundImage(
    0,
    0,
    canvas.width,
    canvas.height,
    bgImg
  );

  const player = new GameObject(canvas.width, 175 - 39, 162, 78, boatPlayer);
  const game = new Game(backgroundImage, player);

  game.start();
}

window.onload = () => {
  startGame();
  //   document.getElementById("start-button").onclick = () => {
  //     startGame();
  //   };
};
