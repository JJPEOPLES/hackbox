# Build stage for client
FROM node:18 AS client-builder

WORKDIR /app/client

# Copy client package.json files
COPY client/package*.json ./

# Install client dependencies with production flag to reduce size
RUN npm install --only=production

# Copy client source code
COPY client ./

# Build client
RUN npm run build

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

# Install server dependencies with production flag
RUN npm install --only=production

# Final stage
FROM node:18-slim

WORKDIR /app

# Copy server from server-builder stage
COPY --from=server-builder /app/server ./server

# Copy client build from client-builder stage
COPY --from=client-builder /app/client/build ./client/build

# Verify the build directory exists
RUN ls -la client/build || echo "Build directory not found!"

# Expose port for server
# Render.com sets the PORT environment variable automatically
EXPOSE 5000
EXPOSE 10000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start server
# The server will use the PORT environment variable provided by Render
CMD ["node", "server/server.js"]