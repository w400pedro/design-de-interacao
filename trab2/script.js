const game = document.getElementById('game');
const barra1 = document.getElementById('barra1');
const barra2 = document.getElementById('barra2');
const bola = document.getElementById('bola');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const welcomeMessage = document.getElementById('welcomeMessage');
const timerDisplay = document.getElementById('timerDisplay');
const endGameMessage = document.getElementById('endGameMessage');
const winnerMessage = document.getElementById('winnerMessage');
const roundTime = document.getElementById('roundTime');
const longestTimeElem = document.getElementById('longestTime');

let bolaX, bolaY, bolaSpeedX, bolaSpeedY;
let barra1Y, barra2Y, barraSpeed;
let gameInterval;
let startTime, elapsedTime = 0;
let longestTime = parseInt(localStorage.getItem('longestTime')) || 0;

// Áudios
const musica = new Audio('musica.mp3');
const vitoria = new Audio('vitoriasom.mp3');
const impacto = new Audio('impactoBola.mp3');
musica.volume = 0.05;
impacto.volume = 0.2;
vitoria.volume = 0.4;
musica.loop = true;

// Calcula velocidades e tamanhos relativos ao tamanho da tela
function calculaVelocidadesETamanhos() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  bolaSpeedX = screenWidth * 0.008;
  bolaSpeedY = screenHeight * 0.009;
  barraSpeed = screenHeight * 0.025; 
  barra1.style.height = `${screenHeight * 0.143}px`;
  barra2.style.height = `${screenHeight * 0.143}px`;
}

function resetaPosicoes() {
  bolaX = game.clientWidth / 2 - 10;
  bolaY = game.clientHeight / 2 - 10;
  barra1Y = game.clientHeight / 2 - barra1.clientHeight / 2;
  barra2Y = game.clientHeight / 2 - barra2.clientHeight / 2;

  barra1.style.top = `${barra1Y}px`;
  barra2.style.top = `${barra2Y}px`;
  bola.style.left = `${bolaX}px`;
  bola.style.top = `${bolaY}px`;
}

function iniciaJogo() {
  calculaVelocidadesETamanhos();
  // Remove a div de boas-vindas do DOM
  welcomeMessage.style.display = 'none';

  startButton.style.display = 'none';
  restartButton.style.display = 'none';
  timerDisplay.style.display = 'block'; // Mostra o temporizador
  musica.play();
  resetaPosicoes();
  startTime = Date.now(); // Registra o início do jogo
  gameInterval = setInterval(atualizaJogo, 16);
}

function reiniciaJogo() {
  musica.play();
  clearInterval(gameInterval);
  resetaPosicoes();
  keys = {}; // Limpar as teclas pressionadas
  barra1Y = game.clientHeight / 2 - barra1.clientHeight / 2;
  barra2Y = game.clientHeight / 2 - barra2.clientHeight / 2;
  barra1.style.top = `${barra1Y}px`;
  barra2.style.top = `${barra2Y}px`;
  iniciaJogo();
}

function atualizaJogo() {
  // Move bola
  bolaX += bolaSpeedX;
  bolaY += bolaSpeedY;

  // Collision with top and bottom walls
  if (bolaY <= 0 || bolaY + bola.clientHeight >= game.clientHeight) {
    bolaSpeedY = -bolaSpeedY;
  }

  // Collision with barras
  if (bolaX <= barra1.offsetLeft + barra1.clientWidth &&
    bolaY + bola.clientHeight >= barra1Y &&
    bolaY <= barra1Y + barra1.clientHeight) {
    impacto.play();
    bolaSpeedX = -bolaSpeedX;
  }

  if (bolaX + bola.clientWidth >= barra2.offsetLeft &&
    bolaY + bola.clientHeight >= barra2Y &&
    bolaY <= barra2Y + barra2.clientHeight) {
    impacto.play();
    bolaSpeedX = -bolaSpeedX;
  }

  // Scoring
  if (bolaX <= 0) {
    endGame('Player 2 venceu!');
  }

  if (bolaX + bola.clientWidth >= game.clientWidth) {
    endGame('Player 1 venceu!');
  }

  // Move barras
  if (keys['ArrowUp'] && barra2Y > 0) {
    barra2Y -= barraSpeed;
  }
  if (keys['ArrowDown'] && barra2Y < game.clientHeight - barra2.clientHeight) {
    barra2Y += barraSpeed;
  }
  if (keys['w'] && barra1Y > 0) {
    barra1Y -= barraSpeed;
  }
  if (keys['s'] && barra1Y < game.clientHeight - barra1.clientHeight) {
    barra1Y += barraSpeed;
  }

  barra1.style.top = `${barra1Y}px`;
  barra2.style.top = `${barra2Y}px`;
  bola.style.left = `${bolaX}px`;
  bola.style.top = `${bolaY}px`;

  // Atualiza o temporizador
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `${elapsedTime}s`;
}

function endGame(winnerMessageText) {
  vitoria.play();
  clearInterval(gameInterval);
  musica.pause();

  // Atualiza o tempo da disputa mais demorada se necessário
  if (elapsedTime > longestTime) {
    longestTime = elapsedTime;
    localStorage.setItem('longestTime', longestTime);
  }

  // Atualiza o card de mensagem
  winnerMessage.textContent = winnerMessageText;
  roundTime.textContent = `Tempo da rodada: ${elapsedTime}s`;
  longestTimeElem.textContent = `Tempo da disputa mais demorada: ${longestTime}s`;

  endGameMessage.style.display = 'block'; // Mostra o card de mensagem
  timerDisplay.style.display = 'none'; // Oculta o temporizador
  restartButton.style.display = 'block';
}

startButton.addEventListener('click', iniciaJogo);
restartButton.addEventListener('click', () => {
  endGameMessage.style.display = 'none'; // Oculta o card de mensagem
  reiniciaJogo();
});

let keys = {}; // Inicializa a variável `keys` como um objeto vazio
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);
