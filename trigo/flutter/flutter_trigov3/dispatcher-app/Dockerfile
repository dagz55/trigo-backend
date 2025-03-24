FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean-up
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Ensure public directory exists with index.html
RUN mkdir -p public && \
    test -f public/index.html || echo '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dispatcher App</title></head><body><div id="root"></div></body></html>' > public/index.html

# Production stage with minimal footprint
FROM node:20-alpine

WORKDIR /app

# Only copy production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --only=production --legacy-peer-deps && \
    npm cache clean --force

# Copy server files but not node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env

# Set environment variables
ENV PORT=3002
ENV NODE_ENV=production
ENV PUBLIC_URL=/

EXPOSE 3002

# Start the application
CMD ["node", "server.js"] 