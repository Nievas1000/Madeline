// Estado del chat
let isOpen = false;
let messageHistory = [];
const sessionId = getSessionId();

// Elementos del DOM
const chatButton = document.getElementById('chatButton');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const typingIndicator = document.getElementById('typingIndicator');
const notificationBadge = document.getElementById('notificationBadge');
const charCounter = document.getElementById('charCounter');

// Event Listeners
chatButton.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Actualizar contador de caracteres
chatInput.addEventListener('input', updateCharCounter);

function updateCharCounter() {
    const length = chatInput.value.length;
    const max = CONFIG.MAX_MESSAGE_LENGTH;

    charCounter.textContent = `${length}/${max}`;

    // Cambiar color según proximidad al límite
    if (length >= max) {
        charCounter.className = 'char-counter error';
    } else if (length >= max * 0.8) {
        charCounter.className = 'char-counter warning';
    } else {
        charCounter.className = 'char-counter';
    }
}

// Inicialización
init();

function init() {
    // Cargar historial de mensajes si existe
    if (CONFIG.STORE_CONVERSATION) {
        loadMessageHistory();
    }

    // Auto-abrir chat si está configurado
    if (CONFIG.AUTO_OPEN_CHAT) {
        setTimeout(() => {
            toggleChat();
        }, 1000);
    }

    // Mostrar notificación si está configurado
    if (CONFIG.SHOW_NOTIFICATION && !isOpen) {
        showNotification();
    }

    // Actualizar tiempos de mensajes
    updateMessageTimes();
    setInterval(updateMessageTimes, 60000); // Actualizar cada minuto
}

function toggleChat() {
    isOpen = !isOpen;
    chatWidget.classList.toggle('active');

    if (isOpen) {
        chatInput.focus();
        hideNotification();
        scrollToBottom();
    }
}

function showNotification() {
    if (notificationBadge) {
        notificationBadge.style.display = 'flex';
    }
}

function hideNotification() {
    if (notificationBadge) {
        notificationBadge.style.display = 'none';
    }
}

async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) return;

    // Validar longitud del mensaje
    if (message.length > CONFIG.MAX_MESSAGE_LENGTH) {
        // Mostrar mensaje de error visual
        chatInput.style.borderColor = '#FF5252';
        chatInput.placeholder = `Máximo ${CONFIG.MAX_MESSAGE_LENGTH} caracteres`;

        // Restaurar después de 2 segundos
        setTimeout(() => {
            chatInput.style.borderColor = '';
            chatInput.placeholder = 'Escribe un mensaje...';
        }, 2000);

        return;
    }

    // Deshabilitar input mientras se procesa
    chatInput.disabled = true;
    chatSend.disabled = true;

    // Añadir mensaje del usuario
    addMessage(message, 'user');

    // Limpiar input
    chatInput.value = '';
    updateCharCounter(); // Actualizar contador a 0

    // Mostrar indicador de escritura
    if (CONFIG.SHOW_TYPING_INDICATOR) {
        showTypingIndicator();
    }

    try {
        // Enviar mensaje al endpoint de n8n
        const response = await sendToN8N(message);

        // Esperar un poco antes de mostrar la respuesta (más natural)
        await sleep(CONFIG.TYPING_DELAY);

        // Ocultar indicador de escritura
        hideTypingIndicator();

        // Añadir respuesta del bot
        addMessage(response, 'bot');

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        hideTypingIndicator();
        addMessage(CONFIG.ERROR_MESSAGE, 'bot');
    } finally {
        // Rehabilitar input
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.focus();
    }
}

async function sendToN8N(message) {
    try {
        const payload = {
            message: message,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            // Puedes añadir más contexto si lo necesitas
            context: {
                url: window.location.href,
                userAgent: navigator.userAgent
            }
        };

        const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ajusta esto según la estructura de respuesta de tu n8n
        // Aquí asumo que tu n8n devuelve { response: "texto de respuesta" }
        // Modifica según tu estructura real
        return data.response || data.message || data.output || 'Respuesta recibida';

    } catch (error) {
        console.error('Error en la comunicación con n8n:', error);
        throw error;
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    // Añadir avatar solo para mensajes del bot
    if (sender === 'bot') {
        const avatar = document.createElement('img');
        avatar.src = CONFIG.BOT_AVATAR;
        avatar.alt = 'Bot';
        avatar.className = 'message-avatar';
        // Forzar estilos inline para asegurar el tamaño correcto
        avatar.style.cssText = 'width: 32px !important; height: 32px !important; max-width: 32px !important; max-height: 32px !important; min-width: 32px !important; min-height: 32px !important; border-radius: 50%; object-fit: cover; flex-shrink: 0;';
        messageDiv.appendChild(avatar);

        // Verificación adicional después de añadir al DOM
        setTimeout(() => {
            if (avatar.offsetWidth > 32) {
                avatar.style.width = '32px';
                avatar.style.height = '32px';
            }
        }, 50);
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const messageText = document.createElement('p');
    messageText.textContent = text;

    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(new Date());
    messageTime.dataset.timestamp = new Date().getTime();

    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Guardar en historial
    const messageObj = {
        text: text,
        sender: sender,
        timestamp: new Date().getTime()
    };
    messageHistory.push(messageObj);

    if (CONFIG.STORE_CONVERSATION) {
        saveMessageHistory();
    }

    // Mostrar notificación si el chat está cerrado y es mensaje del bot
    if (!isOpen && sender === 'bot' && CONFIG.SHOW_NOTIFICATION) {
        showNotification();
    }
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function updateMessageTimes() {
    const timeElements = document.querySelectorAll('.message-time');
    timeElements.forEach(el => {
        const timestamp = parseInt(el.dataset.timestamp);
        if (timestamp) {
            const date = new Date(timestamp);
            el.textContent = formatTime(date);
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Funciones de almacenamiento
function saveMessageHistory() {
    try {
        localStorage.setItem('chat_history', JSON.stringify(messageHistory));
    } catch (error) {
        console.error('Error al guardar historial:', error);
    }
}

function loadMessageHistory() {
    try {
        const stored = localStorage.getItem('chat_history');
        if (stored) {
            messageHistory = JSON.parse(stored);

            // Limpiar mensajes actuales (excepto el de bienvenida)
            chatMessages.innerHTML = '';

            // Recrear mensajes desde el historial
            messageHistory.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender}-message`;

                // Añadir avatar solo para mensajes del bot
                if (msg.sender === 'bot') {
                    const avatar = document.createElement('img');
                    avatar.src = CONFIG.BOT_AVATAR;
                    avatar.alt = 'Bot';
                    avatar.className = 'message-avatar';
                    // Forzar estilos inline
                    avatar.style.cssText = 'width: 32px !important; height: 32px !important; max-width: 32px !important; max-height: 32px !important; min-width: 32px !important; min-height: 32px !important; border-radius: 50%; object-fit: cover; flex-shrink: 0;';
                    messageDiv.appendChild(avatar);
                }

                const messageContent = document.createElement('div');
                messageContent.className = 'message-content';

                const messageText = document.createElement('p');
                messageText.textContent = msg.text;

                const messageTime = document.createElement('span');
                messageTime.className = 'message-time';
                messageTime.textContent = formatTime(new Date(msg.timestamp));
                messageTime.dataset.timestamp = msg.timestamp;

                messageContent.appendChild(messageText);
                messageContent.appendChild(messageTime);
                messageDiv.appendChild(messageContent);

                chatMessages.appendChild(messageDiv);
            });

            scrollToBottom();
        }
    } catch (error) {
        console.error('Error al cargar historial:', error);
    }
}

// Función para limpiar historial (útil para desarrollo)
function clearChatHistory() {
    messageHistory = [];
    localStorage.removeItem('chat_history');
    localStorage.removeItem(CONFIG.SESSION_ID_KEY);
    location.reload();
}

// Exponer función para depuración (puedes llamarla desde la consola)
window.clearChatHistory = clearChatHistory;