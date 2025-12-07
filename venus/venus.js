// ⭐ Criar estrelas aleatórias
const starContainer = document.querySelector('.stars');

for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 3 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.animationDuration = (Math.random() * 2 + 1) + "s";

    starContainer.appendChild(star);
}

