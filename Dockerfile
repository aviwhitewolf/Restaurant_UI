# Multi-stage build for optimized Docker image

# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS runtime

WORKDIR /app

# Install serve to run the Angular app
RUN npm install -g serve

# Copy built application from build stage
COPY --from=build /app/dist/restaurant ./dist/restaurant

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001

USER angular

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4200', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Serve the application
CMD ["serve", "-s", "dist/restaurant", "-l", "4200"]
