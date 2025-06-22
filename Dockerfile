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

# Expose port for server
EXPOSE 5000

# Start server
CMD ["node", "server/server.js"]