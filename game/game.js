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
  const s = document.createElement('div');
  s.className = 'ship';
  s.style.position = 'absolute';
  s.style.bottom = '40px';
  s.style.left = '50%';
  s.style.transform = 'translateX(-50%)';

  const engine = document.createElement('div');
  engine.className = 'engine';
  s.appendChild(engine);

  game.appendChild(s);
  return s;
})();

// 💯 Pontuação
let score = 0;
let speedMultiplier = 1;
let doubleShot = false;
let gameFinished = false;
let difficultyIncreased = false;
let bossSpawned = false;

const scoreBoard = document.createElement('div');
scoreBoard.className = 'score';
scoreBoard.innerText = 'Pontos: 0';
document.body.appendChild(scoreBoard);

// ⏱️ Cronômetro
let startTime = Date.now();
const timerBoard = document.createElement('div');
timerBoard.className = 'score';
timerBoard.style.top = '50px';
timerBoard.style.right = '20px';
timerBoard.innerText = 'Tempo: 0s';
document.body.appendChild(timerBoard);

function updateTimer() {
  if (gameFinished) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerBoard.innerText = `Tempo: ${elapsed}s`;
  requestAnimationFrame(updateTimer);
}

updateTimer();

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

// 🧨 Boss
function spawnBossMeteor() {
  if (bossSpawned || gameFinished) return;
  bossSpawned = true;

  const boss = document.createElement('div');
  boss.className = 'meteor boss';

  const size = 390;
  const speed = 1;
  const life = 65;

  boss.style.width = size + 'px';
  boss.style.height = size + 'px';
  boss.style.left = (window.innerWidth / 2 - size / 2) + 'px';
  boss.style.top = '-140px';

  boss.dataset.life = life;
  boss.dataset.points = 100;

  game.appendChild(boss);

  const fall = setInterval(() => {
    if (gameFinished) {
      clearInterval(fall);
      boss.remove();
      return;
    }

    boss.style.top = boss.offsetTop + speed + 'px';

    if (isColliding(boss, ship)) {
      showGameOver();
      clearInterval(fall);
    }

    if (boss.offsetTop > window.innerHeight) {
      boss.remove();
      clearInterval(fall);
    }
  }, 16);
}

// 🎮 Controle da nave
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
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code in keys) keys[e.code] = false;
});

// 🔫 Tiro
let canShoot = true;

function shootBullet() {
  if (gameFinished || !canShoot) return;
  canShoot = false;

  shootSound.currentTime = 0;
  shootSound.play();

  const rect = ship.getBoundingClientRect();
  const bulletsX = (score >= 150)
    ? [rect.left + rect.width * 0.3, rect.left + rect.width * 0.7]
    : [rect.left + rect.width / 2];

  bulletsX.forEach(x => {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = x - 2 + 'px';
    bullet.style.top = rect.top + 'px';
    game.appendChild(bullet);

    const interval = setInterval(() => {
      if (gameFinished) {
        clearInterval(interval);
        if (bullet.parentElement) bullet.remove();
        return;
      }

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
          createExplosion(r.left + r.width / 2, r.top + r.height / 2);
          explosionSound.currentTime = 0;
          explosionSound.play();

          // Boss
          if (meteor.classList.contains('boss')) {
            meteor.dataset.life--;
            if (meteor.dataset.life <= 0) {
              score += Number(meteor.dataset.points);
              scoreBoard.innerText = `Pontos: ${score}`;
              meteor.remove();
            }
            return;
          }

          // Meteoro normal
          const points = Number(meteor.dataset.points);
          score += points;
          scoreBoard.innerText = `Pontos: ${score}`;

          if (score >= 315 && !difficultyIncreased) {
            speedMultiplier = 1.3;
            difficultyIncreased = true;
          }

          if (score >= 550 && !bossSpawned) {
            spawnBossMeteor();
          }

          if (score >= 1000) {
            showVictory();
            return;
          }

          meteor.remove();
        }
      });
    }, 16);
  });

  setTimeout(() => { canShoot = true; }, 250);
}

// 🔄 Atualiza nave
function updateShip() {
  if (gameFinished) return;

  const speed = 7;
  let left = ship.offsetLeft;
  let top = ship.offsetTop;

  if (keys.ArrowLeft) left -= speed;
  if (keys.ArrowRight) left += speed;
  if (keys.ArrowUp) top -= speed;
  if (keys.ArrowDown) top += speed;

  left = Math.max(0, Math.min(left, window.innerWidth - ship.offsetWidth));
  top = Math.max(0, Math.min(top, window.innerHeight - ship.offsetHeight));

  ship.style.left = left + 'px';
  ship.style.top = top + 'px';

  if (keys.Space) shootBullet();

  requestAnimationFrame(updateShip);
}

updateShip();

// ☄️ Criar meteoros
setInterval(() => {
  if (gameFinished) return;

  const meteor = document.createElement('div');
  meteor.className = 'meteor';

  const isSmall = Math.random() < 0.35;
  let size, points, speed;

  if (isSmall) {
    size = 25;
    points = 10;
    speed = (Math.random() * 3 + 4) * speedMultiplier;
    meteor.classList.add('small');
  } else {
    size = 40;
    points = 5;
    speed = (Math.random() * 2 + 2) * speedMultiplier;
  }

  meteor.style.width = size + 'px';
  meteor.style.height = size + 'px';
  meteor.style.left = Math.random() * (window.innerWidth - size) + 'px';
  meteor.style.top = -size + 'px';

  meteor.dataset.points = points;

  game.appendChild(meteor);

  const fall = setInterval(() => {
    if (gameFinished) {
      clearInterval(fall);
      meteor.remove();
      return;
    }

    meteor.style.top = meteor.offsetTop + speed + 'px';

    if (meteor.offsetTop > window.innerHeight) {
      meteor.remove();
      clearInterval(fall);
    }

    if (isColliding(meteor, ship)) {
      showGameOver();
      clearInterval(fall);
    }
  }, 16);
}, 1000);

// 💥 Game Over
function showGameOver() {
  if (gameFinished) return;
  gameFinished = true;

  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';

  const box = document.createElement('div');
  box.className = 'victory-box';
  box.innerHTML = `<h1>💥 GAME OVER</h1>
    <p>Você perdeu! 🚀</p>
    <button onclick="location.reload()">Jogar novamente</button>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// 🏆 Vitória
function showVictory() {
  if (gameFinished) return;
  gameFinished = true;

  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';

  const box = document.createElement('div');
  box.className = 'victory-box';
  box.innerHTML = `
    <h1>🏆 VICTORY!</h1>
    <p>Você chegou aos <strong>1000 pontos</strong> 🚀</p>
    <button onclick="location.reload()">Jogar novamente</button>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}
