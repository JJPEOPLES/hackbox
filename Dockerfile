# This Dockerfile is a wrapper that builds from Dockerfile.vnc
# It allows us to use the standard Dockerfile name while building the VNC-enabled image

# Simply use the Dockerfile.vnc content
FROM ubuntu:22.04 AS base

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Install VNC, XFCE, and required tools
RUN apt-get update && apt-get install -y \
    xfce4 \
    xfce4-terminal \
    xfce4-goodies \
    tightvncserver \
    novnc \
    websockify \
    net-tools \
    supervisor \
    nano \
    wget \
    firefox \
    python3 \
    python3-pip \
    make \
    g++ \
    && apt-get clean

# Set up VNC password
RUN mkdir -p /root/.vnc
RUN echo "hackbox" | vncpasswd -f > /root/.vnc/passwd
RUN chmod 600 /root/.vnc/passwd

# Build stage for client
FROM node:18 AS client-builder

WORKDIR /app/client

# Copy client package.json files
COPY client/package*.json ./

# Install all client dependencies including dev dependencies
RUN npm install

# Copy client source code
COPY client ./

# Build client with increased memory limit for local build
RUN NODE_OPTIONS="--max_old_space_size=8192" npm run build

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

# Final stage with VNC support
FROM base

# Set up supervisor
COPY vm/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create startup script
RUN mkdir -p /app/scripts
COPY vm/startup.sh /app/scripts/
RUN chmod +x /app/scripts/startup.sh

# Set up noVNC
RUN mkdir -p /app/novnc
RUN ln -s /usr/share/novnc /app/novnc/
RUN ln -s /usr/lib/novnc/utils /app/novnc/utils

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

# Update the VNC endpoint in server.js
RUN sed -i 's/available: false/available: true/g' /app/server/server.js
RUN sed -i 's/message: .*/message: "GUI access is available via VNC",/g' /app/server/server.js
RUN sed -i 's/note: .*/url: "\/novnc\/vnc.html?host=" + req.headers.host + "\&port=6080",\n      password: "hackbox"/g' /app/server/server.js

# Expose ports
EXPOSE 5000 6080 5901 10000

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV VNC_ENABLED=true

# Start services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]