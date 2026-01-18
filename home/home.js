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
    authModal.style.display = 'flex';  // deixa visível
    setTimeout(() => {
        authModal.classList.add('show'); // inicia a animação
    }, 10); // pequeno delay para ativar a transição
});

// Fechar modal
closeAuth.addEventListener('click', () => {
    authModal.classList.remove('show'); // anima para fechar
    setTimeout(() => {
        authModal.style.display = 'none'; // some após a animação
    }, 350); // tempo igual ao da transição do CSS
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

    const form = document.getElementById('google-search-form');
    const input = document.getElementById('google-search-input');

    form.addEventListener('submit', function() {
        // Limpa o campo com um pequeno atraso (50ms)
        setTimeout(() => {
            input.value = '';
        }, 50);
    });

// ⭐ Chat
const chatContainer = document.getElementById('chatContainer');
const chatHeader = document.getElementById('chatHeader');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');

// Abrir/fechar chat
chatHeader.addEventListener('click', () => {
    chatBody.style.display = chatBody.style.display === 'flex' ? 'none' : 'flex';
});

// Enviar mensagem
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Mensagem do usuário
    const userMsg = document.createElement('div');
    userMsg.classList.add('message', 'user');
    userMsg.textContent = text;
    messages.appendChild(userMsg);
    chatInput.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Resposta automática (exemplo)
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.classList.add('message', 'bot');
        botMsg.textContent = "Ainda estou aprendendo a responder. 😉";
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 700);
}

// Enviar ao clicar no botão ou pressionar Enter
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
});
