FROM node:18

WORKDIR /app

# Copy package.json files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN cd server && npm install
RUN cd client && npm install

# Copy source code
COPY server ./server
COPY client ./client

# Build client
RUN cd client && npm run build

# Verify the build directory exists
RUN ls -la client/build || echo "Build directory not found!"

# Expose port for server
# Render.com sets the PORT environment variable automatically
# We'll expose both 5000 (default) and 10000 (common Render port)
EXPOSE 5000
EXPOSE 10000

# Start server
# The server will use the PORT environment variable provided by Render
CMD ["node", "server/server.js"]