// 🎵 Sons
const shootSound = new Audio('shoot.mp3');
const explosionSound = new Audio('explosion.mp3');

// 🌟 Estrelas de fundo
const starsContainer = document.querySelector('.stars');
const starCount = 200;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.animationDuration = `${Math.random() * 3 + 2}s`;
  starsContainer.appendChild(star);
}

// 🕹️ Container do jogo
const game = document.createElement('div');
game.className = 'game';
document.body.appendChild(game);

// 🚀 Nave
const ship = (() => {
  const s = document.createElement('img');
  s.src = 'img/nave.png'; // caminho da imagem
  s.className = 'ship';
  s.style.position = 'absolute';
  s.style.bottom = '20px';
  s.style.left = '50%';
  s.style.transform = 'translateX(-50%)';
  game.appendChild(s);
  return s;
})();

// 💯 Pontuação
let score = 0;
let doubleShot = false; // 🔥 ativa tiro duplo aos 500 pontos
const scoreBoard = document.createElement('div');
scoreBoard.className = 'score';
scoreBoard.innerText = 'Pontos: 0';
document.body.appendChild(scoreBoard);

// ⏱️ Cronômetro
let startTime = Date.now();
const timerBoard = document.createElement('div');
timerBoard.className = 'score'; // reutilizando a classe, mas podemos posicionar diferente
timerBoard.style.top = '50px';
timerBoard.style.right = '20px';
timerBoard.innerText = 'Tempo: 0s';
document.body.appendChild(timerBoard);

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000); // tempo em segundos
  timerBoard.innerText = `Tempo: ${elapsed}s`;
  requestAnimationFrame(updateTimer);
}

updateTimer(); // iniciar o cronômetro

// 📌 Função de colisão
function isColliding(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(
    r1.top > r2.bottom ||
    r1.bottom < r2.top ||
    r1.left > r2.right ||
    r1.right < r2.left
  );
}

// 🎇 Explosão
function createExplosion(x, y) {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = x - 25 + 'px';
  explosion.style.top = y - 25 + 'px';
  game.appendChild(explosion);
  setTimeout(() => explosion.remove(), 400);
}

// 🎮 Controle da nave pelo teclado
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Space: false
};

document.addEventListener('keydown', (e) => {
  if (e.code in keys) {
    keys[e.code] = true;
    e.preventDefault(); // evita scroll da página
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code in keys) keys[e.code] = false;
});

// 🔫 Função de disparo
let canShoot = true; // controla intervalo de tiros

function shootBullet() {
  if (!canShoot) return;
  canShoot = false;

  shootSound.currentTime = 0;
  shootSound.play();

  const rect = ship.getBoundingClientRect();

  // 🔥 Define se atira 1 ou 2 tiros
  const bulletsX = (score >= 450)
    ? [
        rect.left + rect.width * 0.3,
        rect.left + rect.width * 0.7
      ]
    : [
        rect.left + rect.width / 2
      ];

  bulletsX.forEach(x => {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = x - 2 + 'px';
    bullet.style.top = rect.top + 'px';
    game.appendChild(bullet);

    const interval = setInterval(() => {
      bullet.style.top = bullet.offsetTop - 10 + 'px';

      if (bullet.offsetTop < 0) {
        bullet.remove();
        clearInterval(interval);
      }

      document.querySelectorAll('.meteor').forEach(meteor => {
        if (isColliding(bullet, meteor)) {
          bullet.remove();
          clearInterval(interval);

          const r = meteor.getBoundingClientRect();
          createExplosion(
            r.left + r.width / 2,
            r.top + r.height / 2
          );

          explosionSound.currentTime = 0;
          explosionSound.play();

          score += 10;
          scoreBoard.innerText = `Pontos: ${score}`;

          // ✅ verifica vitória
          if (score >= 1000) {
          alert('🏆 Parabéns! Você venceu ao chegar a 1000 pontos!');
          location.reload(); // ou chame uma função winGame()
          }

          meteor.remove();
        }
      });
    }, 16);
  });

  setTimeout(() => { canShoot = true; }, 250);
}

// 🔄 Atualiza posição da nave e atira
function updateShip() {
  const speed = 7;
  const shipWidth = ship.offsetWidth;
  const shipHeight = ship.offsetHeight;

  let left = ship.offsetLeft;
  let top = ship.offsetTop;

  if (keys.ArrowLeft) left -= speed;
  if (keys.ArrowRight) left += speed;
  if (keys.ArrowUp) top -= speed;
  if (keys.ArrowDown) top += speed;

  // Limites da tela
  left = Math.max(0, Math.min(left, window.innerWidth - shipWidth));
  top = Math.max(0, Math.min(top, window.innerHeight - shipHeight));

  ship.style.left = left + 'px';
  ship.style.top = top + 'px';

  if (keys.Space) shootBullet();

  requestAnimationFrame(updateShip);
}

updateShip();

// ☄️ Criar meteoros
setInterval(() => {
  const meteor = document.createElement('div');
  meteor.className = 'meteor';
  meteor.style.left = Math.random() * (window.innerWidth - 40) + 'px';
  meteor.style.top = '-40px';
  game.appendChild(meteor);

  const speed = Math.random() * 3 + 2;
  const fall = setInterval(() => {
    meteor.style.top = meteor.offsetTop + speed + 'px';

    if (meteor.offsetTop > window.innerHeight) {
      meteor.remove();
      clearInterval(fall);
    }

    if (isColliding(meteor, ship)) {
      alert('💥 Game Over');
      location.reload();
    }
  }, 16);
}, 1000);

function winGame() {
  alert('🏆 Parabéns! Você chegou a 1000 pontos!');
  location.reload(); // reinicia o jogo
}
