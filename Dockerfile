# Build stage for client
FROM node:18 AS client-builder

WORKDIR /app/client

# Copy client package.json files
COPY client/package*.json ./

# Install all client dependencies including dev dependencies
RUN npm install

# Copy client source code
COPY client ./

# Build client with memory limit adjusted for 512MB environment
RUN NODE_OPTIONS="--max_old_space_size=384" npm run build

# Build stage for server
FROM node:18 AS server-builder

WORKDIR /app/server

# Copy server package.json files
COPY server/package*.json ./

# Install build dependencies for node-pty
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && ln -s /usr/bin/python3 /usr/bin/python

# Install all server dependencies
RUN npm install

# Copy server source code
COPY server/ ./

# Final stage
FROM node:18-slim

WORKDIR /app

# Copy server from server-builder stage
COPY --from=server-builder /app/server ./server

# Copy client build from client-builder stage
COPY --from=client-builder /app/client/build ./client/build

# Verify directories and files exist
RUN echo "Checking server directory:" && \
    ls -la server/ && \
    echo "Checking for server.js:" && \
    ls -la server/server.js && \
    echo "Checking client build:" && \
    ls -la client/build || echo "Build directory not found!"

# Expose port for server
# Render.com sets the PORT environment variable automatically
EXPOSE 5000
EXPOSE 10000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start server
# The server will use the PORT environment variable provided by Render
CMD ["node", "server/server.js"]