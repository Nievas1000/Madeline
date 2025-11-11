# Widget de Chat IA - Julio Prisiones

Widget de chat estilo WhatsApp con integración a n8n para agentes de IA.

## 📋 Estructura del Proyecto

```
chat-widget/
├── index.html          # Página principal del widget
├── styles.css          # Estilos WhatsApp
├── config.js           # Configuración del widget
├── chat.js             # Lógica principal
├── bot-avatar.png      # Avatar del bot (añadir tu imagen)
└── README.md           # Este archivo
```

## 🚀 Deployment en EasyPanel

### Paso 1: Preparar tu servidor EasyPanel

1. Accede a tu panel de EasyPanel
2. Ve a la sección "Apps" o "Aplicaciones"
3. Haz clic en "Create App" o "Crear Nueva App"

### Paso 2: Configuración de la App

**Opción A: Deployment con Git**

1. Sube este proyecto a un repositorio de GitHub
2. En EasyPanel, selecciona "GitHub" como fuente
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio del widget
5. Configura:
   - **Build Command**: (dejar vacío - es HTML estático)
   - **Start Command**: (dejar vacío)
   - **Port**: 80 o 3000 (EasyPanel asignará automáticamente)

**Opción B: Deployment Manual (más simple)**

1. En EasyPanel, selecciona "Static Site" o "Sitio Estático"
2. Sube los archivos mediante FTP o el file manager de EasyPanel
3. Asegúrate de que `index.html` esté en la raíz del directorio público

### Paso 3: Configuración del Servidor Web

Si EasyPanel te da opciones de servidor:
- Selecciona **Nginx** o **Apache** para sitios estáticos
- No necesitas Node.js ni otros runtimes para este proyecto

### Paso 4: Configurar el Dominio

1. En la configuración de la app en EasyPanel:
2. Ve a la sección "Domain" o "Dominio"
3. Puedes usar:
   - Subdominio de EasyPanel: `chat-widget.tu-dominio.easypanel.host`
   - Tu propio dominio: `chat.julioprisiones.com`

### Paso 5: Habilitar HTTPS

1. EasyPanel generalmente habilita HTTPS automáticamente con Let's Encrypt
2. Verifica que el certificado SSL esté activo
3. Esto es IMPORTANTE porque tu sitio principal (julioprisiones.com) usa HTTPS

## ⚙️ Configuración del Widget

### 1. Configurar el Endpoint de n8n

Edita el archivo `config.js`:

```javascript
const CONFIG = {
    // Reemplaza con tu URL de n8n
    N8N_WEBHOOK_URL: 'https://tu-n8n.com/webhook/tu-webhook-id',
    
    BOT_NAME: 'Asistente Julio Prisiones',
    BOT_AVATAR: 'bot-avatar.png',
    // ... resto de configuración
};
```

### 2. Configurar la Imagen del Bot

1. Añade tu imagen del bot como `bot-avatar.png` en la raíz del proyecto
2. Recomendado: imagen cuadrada de 200x200px o 400x400px
3. Formato: PNG o JPG

### 3. Personalizar Mensajes

En `config.js` puedes cambiar:
- Mensaje de bienvenida
- Nombre del bot
- Mensajes de error
- Comportamiento del widget

## 🔗 Estructura del Endpoint de n8n

Tu webhook de n8n debe recibir un POST con este formato:

```json
{
  "message": "Mensaje del usuario",
  "sessionId": "session_123456",
  "timestamp": "2024-11-11T10:00:00.000Z",
  "context": {
    "url": "https://julioprisiones.com",
    "userAgent": "Mozilla/5.0..."
  }
}
```

Y debe devolver una respuesta en formato JSON:

```json
{
  "response": "Respuesta del agente de IA"
}
```

### Ejemplo de Workflow en n8n

```
┌──────────────┐
│   Webhook    │
│   (Trigger)  │
└──────┬───────┘
       │
┌──────▼───────┐
│  Extraer     │
│  Mensaje     │
└──────┬───────┘
       │
┌──────▼───────┐
│   Agente IA  │
│  (OpenAI/    │
│   Anthropic) │
└──────┬───────┘
       │
┌──────▼───────┐
│   Respond    │
│   Webhook    │
└──────────────┘
```

## 🌐 Integración en el Sitio Web

### Método 1: Integración con iframe (Recomendado)

Añade este código antes del cierre de `</body>` en tu sitio:

```html
<!-- Widget de Chat -->
<iframe 
    id="chatWidget" 
    src="https://chat-widget.tu-dominio.com" 
    style="
        position: fixed;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border: none;
        pointer-events: none;
        z-index: 9999;
    "
    allow="clipboard-read; clipboard-write"
></iframe>

<script>
// Permitir interacción solo en el área del widget
document.getElementById('chatWidget').addEventListener('load', function() {
    this.style.pointerEvents = 'auto';
});
</script>
```

### Método 2: Integración Directa (Sin iframe)

Si tienes control total del sitio, puedes integrar directamente:

```html
<!-- En el <head> de tu sitio -->
<link rel="stylesheet" href="https://chat-widget.tu-dominio.com/styles.css">

<!-- Antes del cierre </body> -->
<script src="https://chat-widget.tu-dominio.com/config.js"></script>
<script src="https://chat-widget.tu-dominio.com/chat.js"></script>

<!-- Widget HTML -->
<div class="chat-button" id="chatButton">
    <img src="https://chat-widget.tu-dominio.com/bot-avatar.png" alt="Chat Bot">
</div>
<!-- ... resto del HTML del widget -->
```

### Método 3: Script Embebido (Más Simple)

Crea un archivo `embed.js` con este contenido:

```javascript
(function() {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://chat-widget.tu-dominio.com';
    iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:100%;height:100%;border:none;pointer-events:auto;z-index:9999;';
    iframe.allow = 'clipboard-read; clipboard-write';
    document.body.appendChild(iframe);
})();
```

Luego en tu sitio solo añade:

```html
<script src="https://chat-widget.tu-dominio.com/embed.js"></script>
```

## 🎨 Personalización de Estilos

Los colores actuales están basados en tu sitio web:
- Color principal: `#00BCD4` (cyan/turquesa)
- Color hover: `#0097A7`

Para cambiar colores, edita en `styles.css`:

```css
/* Busca estos valores y cámbialos */
background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
background: #00BCD4; /* Botón enviar */
```

## 🧪 Testing Local

Para probar localmente antes de deployar:

1. Instala un servidor web simple:
```bash
npm install -g http-server
```

2. En la carpeta del proyecto:
```bash
http-server -p 8080
```

3. Abre: `http://localhost:8080`

**IMPORTANTE**: Configura tu n8n para aceptar requests desde localhost durante testing.

## 🔧 Solución de Problemas

### El chat no envía mensajes

1. Verifica que la URL de n8n en `config.js` sea correcta
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que tu n8n tenga CORS habilitado:

En n8n, en tu webhook node, habilita:
- Options → Response → Response Headers
- Añade: `Access-Control-Allow-Origin: *` (o tu dominio específico)

### El widget no aparece en el sitio

1. Verifica que el iframe se haya cargado correctamente
2. Revisa si hay conflictos de z-index con otros elementos
3. Comprueba que no haya bloqueadores de contenido activos

### Problemas de CORS

Si ves errores de CORS en la consola:

**Solución en n8n:**
```
Webhook Node → Settings → Options → 
Response Headers:
  Access-Control-Allow-Origin: https://julioprisiones.com
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

## 📱 Responsive

El widget es completamente responsive:
- Desktop: Widget de 380x600px
- Mobile: Ocupa casi toda la pantalla
- Tablet: Se adapta automáticamente

## 🔒 Seguridad

### Recomendaciones:

1. **Limita CORS en n8n** a tu dominio específico
2. **Implementa rate limiting** en n8n para evitar abuso
3. **No expongas información sensible** en el código del cliente
4. **Valida todas las entradas** en el lado del servidor (n8n)
5. **Usa HTTPS** siempre (EasyPanel lo hace automático)

### Rate Limiting en n8n

Añade un nodo "Function" antes del agente:

```javascript
// Verificar límite de mensajes por sesión
const sessionId = $json.sessionId;
const storage = $workflow.staticData;

if (!storage[sessionId]) {
    storage[sessionId] = { count: 0, lastReset: Date.now() };
}

// Resetear cada hora
if (Date.now() - storage[sessionId].lastReset > 3600000) {
    storage[sessionId] = { count: 0, lastReset: Date.now() };
}

// Límite: 50 mensajes por hora
if (storage[sessionId].count >= 50) {
    throw new Error('Límite de mensajes alcanzado');
}

storage[sessionId].count++;
return $input.all();
```

## 📊 Analytics (Opcional)

Para trackear uso del chat:

```javascript
// En chat.js, añade después de sendToN8N:
if (typeof gtag !== 'undefined') {
    gtag('event', 'chat_message_sent', {
        'event_category': 'Chat',
        'event_label': 'User Message'
    });
}
```

## 🆘 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Verifica los logs de n8n
3. Comprueba los logs del servidor en EasyPanel
4. Usa `clearChatHistory()` en la consola para resetear el chat

## 📄 Licencia

Uso libre para tu proyecto Julio Prisiones.

---

**Desarrollado para**: Julio Prisiones - Curso de Ayudantes de Instituciones Penitenciarias
**Versión**: 1.0.0
**Fecha**: Noviembre 2024
