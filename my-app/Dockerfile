# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Setup Backend ---
FROM node:20-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Go back to /app and copy backend files
WORKDIR /app
COPY backend ./backend/

# Copy built frontend from Stage 1 to the location backend expects
COPY --from=frontend-builder /app/frontend/dist ./dist

# Expose the backend port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
WORKDIR /app/backend
CMD ["npm", "start"]
