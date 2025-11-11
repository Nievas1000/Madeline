// Configuración del Chat Widget
const CONFIG = {
    // URL del endpoint de n8n (webhook)
    // Reemplaza esto con tu URL de n8n
    N8N_WEBHOOK_URL: 'https://julioprisiones-n8n.lry4rt.easypanel.host/webhook/a26b8908-bab3-44c7-adf4-8738416bcc42',

    // Configuración del bot
    BOT_NAME: 'Julio',
    BOT_AVATAR: 'made-logo.jpg', // Puedes cambiar por tu imagen

    // Mensajes del sistema
    WELCOME_MESSAGE: '¡Hola! 👋 Soy Julio. ¿En qué puedo ayudarte?',
    ERROR_MESSAGE: 'Lo siento, hubo un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?',

    // Configuración de comportamiento
    SHOW_TYPING_INDICATOR: true,
    TYPING_DELAY: 800, // Milisegundos antes de mostrar la respuesta
    AUTO_OPEN_CHAT: false, // Abrir automáticamente el chat al cargar la página
    SHOW_NOTIFICATION: true, // Mostrar badge de notificación

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
