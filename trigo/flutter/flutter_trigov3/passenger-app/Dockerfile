FROM node:20-alpine as builder

WORKDIR /app

# Install React scripts
RUN npm install -g pnpm

# Copy package files and install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application source
COPY public ./public
COPY src ./src
COPY .env* ./

# Build the React application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve for production hosting
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
