FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies with clean-up
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

COPY . .

# Build the app (copies the public folder content to build)
RUN npm run build

# Production stage with minimal footprint
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

# Install serve to host the static build
RUN npm install -g serve && \
    npm cache clean --force

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV PUBLIC_URL=/

EXPOSE 3000

# Use serve to serve the static files with proper configuration
CMD ["serve", "-s", "build", "-l", "3000"] 

