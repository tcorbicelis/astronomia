// Gerar estrelas aleatórias
    const starsContainer = document.querySelector('.stars');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 2 + 1; // tamanho entre 1 e 3px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      starsContainer.appendChild(star);
    }

const galaxy = document.querySelector('.galaxy-3d');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * -30;

  galaxy.style.transform = `
    rotateY(${x}deg)
    rotateX(${y}deg)
  `;
});

