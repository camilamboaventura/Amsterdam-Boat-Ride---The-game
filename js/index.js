const gameMusic = new Audio();
gameMusic.src = "./../sounds/loveIsTheClass.mp3";
gameMusic.volume = 0.1;

const gameOverSound = new Audio();
gameOverSound.src = "./sounds/gameOverSound.ogg";
gameOverSound.volume = 0.1;

const container = document.querySelector(".container");
const reloadButton = document.getElementById("resetButton");

const canvas = document.getElementById("canvas-board");
const ctx = canvas.getContext("2d");

const canvasStart = document.querySelector(".canvas");

const resetGame = document.querySelector(".reset");

const finalScore = document.getElementById("finalScore");

//instanciando as imagens
const bgImg = new Image();
bgImg.src = "./images/amsterdam_canal3.png";

const boatPlayer = new Image();
boatPlayer.src = "./images/boat_player2.png";

const boatObstacle = new Image();
boatObstacle.src = "./images/boat_obstacle.png";

const boatObstacleBlue = new Image();
boatObstacleBlue.src = "./images/boat_obstacle2.png";

const bather = new Image();
bather.src = "./images/bather.png";

const swan = new Image();
swan.src = "./images/swan.png";

const sup = new Image();
sup.src = "./images/sup.png";

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
    this.y += this.speedY; //atualiza a posição do barco e dos obstáculos

    if (this.y <= this.height + 220) {
      this.y = this.height + 220;
    }

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
    }

    this.x += this.speedX;
  }

  draw() {
    //desenha as imagens no canvas
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
    //determina as possibilidades de colisão
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
    this.speedX = -3;
  }

  updatePosition() {
    //atualiza a posição da imagem de fundo incrementando a velocidade
    this.x += this.speedX;
    this.x %= canvas.width;
  }

  draw() {
    //a imagem de fundo é desenhada duas vezes para que as duas se unam, funcionem como uma esteira, mas se parecem como uma única imagem na tela
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
    this.obstaclesImages = [boatObstacle, boatObstacleBlue, bather, swan, sup];
  }

  start = () => {
    this.updateGame();
  };

  updateGame = () => {
    //determina a ordem do funcionamento do jogo; atualiza as sequências de açōes determinadas por cada método.
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition();
    this.player.draw();

    this.updateObstacles();

    this.updateScore();

    this.animationID = requestAnimationFrame(this.updateGame); //faz os objetos de movimentarem("animarem")

    this.checkGameOver();
  };

  updateObstacles = () => {
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) {
      //percorre o array de obstáculos
      this.obstacles[i].speedX = -3; //velocidade dos obstáculos
      this.obstacles[i].updatePosition(); //atualiza a posição dos obstáculos
      this.obstacles[i].draw(); //desenha
    }

    if (this.frames % 120 === 0) {
      //frequência pela qual os obstáculos aparecerem na tela
      const randomObstacle = Math.floor(
        Math.random() * this.obstaclesImages.length
      );

      const originX = 750; //ponto de origem no eixo x

      const minY = 300;
      const maxY = 580;
      const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY; //determina o aparecimento randômico dos obstáculos

      const imageRandom = this.obstaclesImages[randomObstacle];
      const obstacle = new GameObject(
        originX,
        randomY,
        imageRandom.width,
        imageRandom.height,
        imageRandom
      );
      this.obstacles.push(obstacle); //add no array de obstáculos

      this.score++; //incrementa a pontuação do jogo
    }
  };

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      //verifica se houve a colisão
      return this.player.crashWith(obstacle);
    });

    if (crashed) {
      //se houve colisão a música para de tocar, toca o audio do game over
      gameMusic.pause();
      gameOverSound.play();

      cancelAnimationFrame(this.animationID); //para as animações

      this.gameOver(); //chama o método
    }
  };

  updateScore() {
    //mostra a pontuação no canvas nas coordenadas determinadas abaixo
    ctx.font = "30px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.score}`, 50, 40);
  }

  gameOver() {
    //tela do game over
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffc68c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvasStart.style.display = "none";
    resetGame.style.display = "flex";
    finalScore.textContent = `Your Final Score: ${this.score}`;
  }

  clear = () => {
    //limpa a tela do canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  //inicia o jogo

  const backgroundImage = new BackgroundImage(
    0,
    0,
    canvas.width,
    canvas.height,
    bgImg
  );

  const player = new GameObject(
    canvas.width - 780,
    390,
    boatPlayer.width,
    boatPlayer.height,
    boatPlayer
  );
  const game = new Game(backgroundImage, player, boatObstacle);

  game.start();

  //definindo setas para cima e para baixo como teclas para movimentar o barco
  document.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown"].indexOf(event.code) > -1) {
      //as setas não serão utilizadas para rolagem da página
      event.preventDefault();
    }
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
    canvasStart.style.display = "block";
    gameMusic.play();
    startGame();
  };

  //botão que reinicia o jogo
  reloadButton.onclick = () => {
    document.location.reload(true);
  };
};
