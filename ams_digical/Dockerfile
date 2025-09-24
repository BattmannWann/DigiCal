# === Stage 1: Setup React Frontend Development ===
FROM node:18-alpine AS frontend

WORKDIR /app

COPY frontend/package*.json ./  
COPY frontend/ .                


RUN npm install

EXPOSE 3000


CMD ["sh", "-c", "npm install && npm start"]

# === Stage 2: Setup Django Backend ===
FROM python:3.11-slim AS backend

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["/entrypoint.sh"]
