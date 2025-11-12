# Dockerfile para Widget de Chat - Julio Prisiones
# Usa Nginx para servir archivos estáticos

FROM nginx:alpine

# Metadatos
LABEL maintainer="Lautaro - Julio Prisiones Chat Widget"
LABEL description="Widget de chat con IA integrado con n8n"

# Copiar archivos del proyecto al directorio de Nginx
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/
COPY chat.js /usr/share/nginx/html/
COPY embed.js /usr/share/nginx/html/

# Copiar imagen del avatar
COPY made-logo.jpg /usr/share/nginx/html/

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]