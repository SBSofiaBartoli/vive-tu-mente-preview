# Usa la imagen base de Nginx
FROM nginx:latest

# Copia el archivo de configuración de Nginx a la ubicación adecuada
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 del contenedor
EXPOSE 80

# Copia los archivos HTML al directorio de Nginx
COPY html /usr/share/nginx/html
