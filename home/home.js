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


// ⭐ Login/Cadastro - Modal
const profileBtn = document.getElementById('profileBtn');
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Abrir modal
profileBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
});

// Fechar modal
closeAuth.addEventListener('click', () => {
    authModal.style.display = 'none';
});

// Fechar clicando fora do modal
window.addEventListener('click', (event) => {
    if (event.target === authModal) {
        authModal.style.display = 'none';
    }
});

// ⭐ Alternar entre Login e Cadastro
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');

    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');

    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});