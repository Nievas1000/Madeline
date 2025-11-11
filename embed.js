/**
 * Script de integración del Widget de Chat
 * 
 * Uso: Añade este script en tu sitio web antes del cierre de </body>
 * <script src="https://chat-widget.tu-dominio.com/embed.js"></script>
 */

(function() {
    'use strict';
    
    // Configuración
    const WIDGET_URL = 'https://chat-widget.tu-dominio.com'; // Cambia esto por tu URL
    
    // Verificar que no se haya cargado ya
    if (window.chatWidgetLoaded) {
        console.warn('El widget de chat ya está cargado');
        return;
    }
    
    window.chatWidgetLoaded = true;
    
    // Crear contenedor del iframe
    function createChatWidget() {
        const iframe = document.createElement('iframe');
        iframe.id = 'julioprisiones-chat-widget';
        iframe.src = WIDGET_URL;
        iframe.setAttribute('allow', 'clipboard-read; clipboard-write');
        iframe.setAttribute('title', 'Chat de Asistencia - Julio Prisiones');
        
        // Estilos del iframe
        iframe.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border: none;
            pointer-events: auto;
            z-index: 9999;
            background: transparent;
        `;
        
        return iframe;
    }
    
    // Inicializar cuando el DOM esté listo
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', insertWidget);
        } else {
            insertWidget();
        }
    }
    
    // Insertar widget en la página
    function insertWidget() {
        const widget = createChatWidget();
        document.body.appendChild(widget);
        
        // Comunicación con el iframe (opcional)
        window.addEventListener('message', handleWidgetMessage);
        
        console.log('✓ Widget de chat de Julio Prisiones cargado');
    }
    
    // Manejar mensajes del widget (opcional - para funcionalidades avanzadas)
    function handleWidgetMessage(event) {
        // Verifica el origen por seguridad
        if (event.origin !== new URL(WIDGET_URL).origin) return;
        
        const { type, data } = event.data;
        
        switch (type) {
            case 'chatOpened':
                // El usuario abrió el chat
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'chat_opened', { event_category: 'Chat' });
                }
                break;
            case 'chatClosed':
                // El usuario cerró el chat
                break;
            case 'messageSent':
                // El usuario envió un mensaje
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'chat_message_sent', { event_category: 'Chat' });
                }
                break;
        }
    }
    
    // API pública (opcional - para control desde la página padre)
    window.julioPrisionesChat = {
        open: function() {
            const iframe = document.getElementById('julioprisiones-chat-widget');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'openChat' }, WIDGET_URL);
            }
        },
        close: function() {
            const iframe = document.getElementById('julioprisiones-chat-widget');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'closeChat' }, WIDGET_URL);
            }
        },
        sendMessage: function(message) {
            const iframe = document.getElementById('julioprisiones-chat-widget');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ 
                    type: 'sendMessage', 
                    message: message 
                }, WIDGET_URL);
            }
        }
    };
    
    // Iniciar
    init();
    
})();
