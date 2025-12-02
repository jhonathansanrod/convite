// Configuração do Scroll Reveal
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Disparar uma vez para elementos já visíveis
    revealOnScroll();
}

// Criar confetes otimizados
function createConfetti(amount = 50) {
    const container = document.getElementById('confetti-container');
    const colors = ['#FFD700', '#C8102E', '#FFFFFF', '#000000'];

    // Limitar número de confetes na tela para performance
    if (container.children.length > 300) {
        container.innerHTML = '';
    }

    for (let i = 0; i < amount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Posição aleatória
        confetti.style.left = Math.random() * 100 + 'vw';

        // Cor aleatória
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Tamanho aleatório
        const size = Math.random() * 8 + 4;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';

        // Formas variadas (quadrado e círculo)
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }

        // Animação
        const animationDuration = Math.random() * 3 + 3;
        const delay = Math.random() * 2;

        confetti.style.animation = `fall ${animationDuration}s linear ${delay}s forwards`;

        // Rotação inicial aleatória
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        container.appendChild(confetti);

        // Remover após animação
        setTimeout(() => {
            if (confetti.parentNode === container) {
                container.removeChild(confetti);
            }
        }, (animationDuration + delay) * 1000);
    }
}

// Estilos de animação de confete dinâmicos
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fall {
    0% {
        top: -20px;
        opacity: 1;
        transform: translateX(0) rotate(0deg);
    }
    25% {
        transform: translateX(${Math.random() * 20 - 10}px) rotate(90deg);
    }
    50% {
        transform: translateX(${Math.random() * 20 - 10}px) rotate(180deg);
    }
    75% {
        transform: translateX(${Math.random() * 20 - 10}px) rotate(270deg);
    }
    100% {
        top: 110vh;
        opacity: 0;
        transform: translateX(${Math.random() * 20 - 10}px) rotate(360deg);
    }
}`;
document.head.appendChild(styleSheet);

// Iniciar confetes periodicamente com menos frequência mas mais impacto
setInterval(() => createConfetti(30), 4000);

// Contagem regressiva
function updateCountdown() {
    const eventDate = new Date('December 20, 2025 12:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    if (timeLeft < 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            document.getElementById(id).textContent = '00';
        });
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Atualizar contagem a cada segundo
setInterval(updateCountdown, 1000);
updateCountdown();

// Elementos DOM
const confirmBtn = document.getElementById('confirmBtn');
const shareBtn = document.getElementById('shareBtn');
const confirmationForm = document.getElementById('confirmationForm');
const attendanceForm = document.getElementById('attendanceForm');
const cancelBtn = document.getElementById('cancelBtn');

// Botão de confirmar presença
if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
        confirmationForm.style.display = 'block';
        // Scroll suave até o formulário
        setTimeout(() => {
            confirmationForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        confirmBtn.style.display = 'none';
        shareBtn.style.display = 'none';
    });
}

// Botão de cancelar no formulário
if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
        confirmationForm.style.display = 'none';
        confirmBtn.style.display = 'flex';
        shareBtn.style.display = 'flex';

        // Scroll de volta para os botões
        document.querySelector('.cta-buttons').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Envio do formulário
if (attendanceForm) {
    attendanceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = this.querySelector('input[type="text"]').value;
        const team = this.querySelector('input[name="team"]:checked')?.value || 'não informado';
        const guests = this.querySelector('input[type="number"]').value;

        // Formatar mensagem para o WhatsApp
        let teamText = team === 'corinthians' ? 'Corinthians' : (team === 'sao-paulo' ? 'São Paulo' : 'Outro');

        const message = `*CONFIRMAÇÃO DE PRESENÇA* 🎉%0A%0A` +
            `*Nome:* ${name}%0A` +
            `*Time:* ${teamText}%0A` +
            `*Acompanhantes:* ${guests}%0A%0A` +
            `Estou confirmado na festa! ⚽`;

        const phoneNumber = '5534991947589';
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

        confirmationForm.style.display = 'none';

        const btn = confirmBtn;
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="fab fa-whatsapp"></i> ENVIANDO...';
        btn.style.background = '#25D366';
        btn.style.display = 'flex';
        shareBtn.style.display = 'flex';

        // Scroll de volta
        document.querySelector('.cta-buttons').scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Notificação aprimorada
        showNotification(name, team, guests);

        // Explosão de confetes
        createConfetti(200);

        // Redirecionar para o WhatsApp após um breve delay para a animação
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');

            // Restaurar botão
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 1500);

        attendanceForm.reset();
    });
}

function showNotification(name, team, guests) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: rgba(20, 20, 20, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid #00a86b;
        color: white;
        padding: 25px;
        border-radius: 15px;
        z-index: 10000;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        font-family: 'Montserrat', sans-serif;
        transform: translateX(150%);
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        gap: 20px;
        max-width: 400px;
    `;

    let teamText = team === 'corinthians' ? 'Corinthians' : (team === 'sao-paulo' ? 'São Paulo' : 'outro time');
    let teamColor = team === 'corinthians' ? '#C8102E' : (team === 'sao-paulo' ? '#FFFFFF' : '#FFD700');

    notification.innerHTML = `
        <div style="background: #00a86b; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i class="fas fa-check" style="font-size: 1.5rem;"></i>
        </div>
        <div>
            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 5px; color: #00a86b;">Presença Confirmada!</div>
            <div style="font-size: 0.9rem; color: #ccc; line-height: 1.4;">
                Obrigado, <strong>${name}</strong>! <br>
                ${guests > 0 ? `+ ${guests} acompanhante(s).` : ''}
                <span style="color: ${teamColor}; font-weight: 600;">Vai ${teamText}!</span>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 10);

    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 6000);
}

// Botão de compartilhar
if (shareBtn) {
    shareBtn.addEventListener('click', function () {
        const btn = this;
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            if (navigator.share) {
                navigator.share({
                    title: 'Aniversário Mario & Jhonathan',
                    text: 'Venha comemorar o aniversário do Mario e Jhonathan com tema Corinthians x São Paulo!',
                    url: window.location.href
                }).then(() => {
                    btn.innerHTML = originalHTML;
                }).catch(() => {
                    btn.innerHTML = originalHTML;
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
                setTimeout(() => btn.innerHTML = originalHTML, 2000);
            }
        }, 500);
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    // Explosão inicial de confetes
    createConfetti(100);
});
