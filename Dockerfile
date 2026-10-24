# Versions figées : un tag flottant (node:24-alpine, nginx:alpine) resterait sur l'image
# gardée en cache par le serveur de build. Monter ces numéros à chaque avis de sécurité.

# Build stage : site (Vite)
FROM node:24.22.1-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Build stage : maquette « Passeport produit bâtiment » (Next.js, export statique servi sous /passeport/)
FROM node:24.22.1-alpine AS passeport

WORKDIR /app/passeport

COPY passeport/package*.json ./
RUN npm ci

COPY passeport/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM nginx:1.31.8-alpine

# Copy built assets from build stages
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=passeport /app/passeport/out /usr/share/nginx/html/passeport

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
