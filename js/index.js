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

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
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
  constructor(background, player) {
    this.background = background;
    this.player = player;
    this.frames = 0;
    this.animationID;
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

    this.animationID = requestAnimationFrame(this.updateGame);
  };

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  const bgImg = new Image();
  bgImg.src = "./images/amsterdam_canal3.png";

  const boatPlayer = new Image();
  boatPlayer.src = "./images/boat_player2.png";

  const backgroundImage = new BackgroundImage(
    0,
    0,
    canvas.width,
    canvas.height,
    bgImg
  );

  const player = new GameObject(canvas.width - 780, 390, 170, 100, boatPlayer);
  const game = new Game(backgroundImage, player);

  game.start();

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
      game.player.speedY = -2;
    } else if (event.code === "ArrowDown") {
      game.player.speedY = 2;
    }
  });

  document.addEventListener("keyup", () => {
    game.player.speedY = 0;
  });
}

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
};
