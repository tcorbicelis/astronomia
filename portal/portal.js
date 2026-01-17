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
const ship = document.querySelector('.ship') || (() => {
  const s = document.createElement('div');
  s.className = 'ship';
  game.appendChild(s);
  return s;
})();

// 💯 Pontuação
let score = 0;
const scoreBoard = document.createElement('div');
scoreBoard.className = 'score';
scoreBoard.innerText = 'Pontos: 0';
document.body.appendChild(scoreBoard);

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

// 🖱️ Movimento da nave
document.addEventListener('mousemove', (e) => {
  ship.style.left = `${e.clientX}px`;
});

// 🔫 Disparo da nave
document.addEventListener('click', () => {
  // 🔊 Som do tiro
  shootSound.currentTime = 0;
  shootSound.play();

  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  const rect = ship.getBoundingClientRect();
  bullet.style.left = rect.left + rect.width / 2 + 'px';
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

        // 💥 Explosão
        const r = meteor.getBoundingClientRect();
        createExplosion(r.left + r.width / 2, r.top + r.height / 2);
        explosionSound.currentTime = 0;
        explosionSound.play();

        // ✅ Pontuação
        score += 10;
        scoreBoard.innerText = `Pontos: ${score}`;

        // 🪨 Meteoro morre
        meteor.remove();
      }
    });
  }, 16);
});

// ☄️ Criar meteoros
setInterval(() => {
  const meteor = document.createElement('div');
  meteor.className = 'meteor';
  meteor.style.left = Math.random() * window.innerWidth + 'px';
  meteor.style.top = '-40px';
  meteor.life = 1;
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
