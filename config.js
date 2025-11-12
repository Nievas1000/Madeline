// Configuración del Chat Widget
const CONFIG = {
    // URL del endpoint de n8n (webhook)
    // Reemplaza esto con tu URL de n8n
    N8N_WEBHOOK_URL: 'https://tu-instancia-n8n.com/webhook/tu-webhook-id',

    // Configuración del bot
    BOT_NAME: 'Xuxa',
    BOT_AVATAR: 'made-logo.jpg', // Tu imagen del bot

    // Mensajes del sistema
    WELCOME_MESSAGE: '¡Hola! 👋 Soy Xuxa!. ¿En qué puedo ayudarte hoy?',
    ERROR_MESSAGE: 'Lo siento, hubo un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?',

    // Configuración de comportamiento
    SHOW_TYPING_INDICATOR: true,
    TYPING_DELAY: 800, // Milisegundos antes de mostrar la respuesta
    AUTO_OPEN_CHAT: false, // Abrir automáticamente el chat al cargar la página
    SHOW_NOTIFICATION: true, // Mostrar badge de notificación
    MAX_MESSAGE_LENGTH: 200, // Máximo de caracteres por mensaje (aprox. 25-30 palabras)

    // Almacenamiento de conversación
    STORE_CONVERSATION: true, // Guardar conversación en localStorage
    SESSION_ID_KEY: 'chat_session_id'
};

// Generar o recuperar session ID para continuidad de conversación
function getSessionId() {
    let sessionId = localStorage.getItem(CONFIG.SESSION_ID_KEY);
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(CONFIG.SESSION_ID_KEY, sessionId);
    }
    return sessionId;
}