---
description: Protocolo estricto de despliegue a producción
---
cd ~/jairo

# 1. Construir API (instala nuevas librerías)
docker build --no-cache -t ghcr.io/expertosti/jairo-api:latest -f apps/api/Dockerfile .

# 2. Construir Web (nuevo botón de login)
docker build --no-cache -t ghcr.io/expertosti/jairo-web:latest -f apps/web/Dockerfile .

# 3. Actualizar Stack
docker stack deploy -c docker-stack.yml jairo --with-registry-auth
