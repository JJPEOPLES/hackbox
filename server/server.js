require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { spawn } = require('node-pty');
const axios = require('axios');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
// Always serve static files in Docker environment
app.use(express.static(path.join(__dirname, '../client/build')));

// Add a specific route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    clientBuildPath: path.join(__dirname, '../client/build'),
    clientBuildExists: require('fs').existsSync(path.join(__dirname, '../client/build')),
    clientIndexExists: require('fs').existsSync(path.join(__dirname, '../client/build/index.html'))
  });
});

// VM status endpoint
app.get('/api/vm/status', async (req, res) => {
  try {
    // For Render.com, we're using the same server for both the API and terminal
    // So the VM is always "running" when the server is up
    res.json({
      status: 'running',
      ip: req.headers.host || '127.0.0.1',
      memory: '512MB',
      uptime: 'Since server start',
      provider: 'Render.com'
    });
  } catch (error) {
    console.error('Error checking VM status:', error);
    res.status(500).json({ error: 'Failed to check VM status' });
  }
});

// Start VM endpoint
app.post('/api/vm/start', async (req, res) => {
  try {
    // For Render.com, the server is already running, so we just return success
    res.json({ 
      status: 'running', 
      message: 'VM is running on Render.com',
      note: 'On Render.com, the VM starts automatically with the server'
    });
  } catch (error) {
    console.error('Error starting VM:', error);
    res.status(500).json({ error: 'Failed to start VM' });
  }
});

// Stop VM endpoint
app.post('/api/vm/stop', async (req, res) => {
  try {
    // For Render.com, we can't stop the VM separately from the server
    // So we just return a message explaining this
    res.json({ 
      status: 'running', 
      message: 'VM remains running on Render.com',
      note: 'On Render.com, the VM stops automatically when the server is inactive'
    });
  } catch (error) {
    console.error('Error stopping VM:', error);
    res.status(500).json({ error: 'Failed to stop VM' });
  }
});

// VNC access endpoint
app.get('/api/vm/vnc', async (req, res) => {
  try {
    // For now, we'll return a placeholder response
    // In a real implementation, you would set up a VNC server and return actual connection details
    res.json({
      available: false,
      message: 'GUI access is not currently available on this deployment',
      note: 'GUI access requires additional configuration on the server'
    });
  } catch (error) {
    console.error('Error getting VNC details:', error);
    res.status(500).json({ error: 'Failed to get VNC details' });
  }
});

// Socket.io for terminal
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Create terminal process - use bash or sh depending on what's available
  const shell = process.platform === 'win32' ? 'powershell.exe' : (process.env.SHELL || 'bash');
  
  const term = spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || process.env.HOMEPATH,
    env: process.env
  });
  
  // Handle terminal data
  term.onData(data => {
    socket.emit('terminal-output', data);
  });
  
  // Handle client input
  socket.on('terminal-input', (data) => {
    term.write(data);
  });
  
  // Handle resize
  socket.on('terminal-resize', (size) => {
    try {
      term.resize(size.cols, size.rows);
    } catch (error) {
      console.error('Error resizing terminal:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    try {
      term.kill();
    } catch (error) {
      console.error('Error killing terminal process:', error);
    }
  });
});

// Catch-all handler for client-side routing
// Always handle client-side routing in Docker environment
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // For all other routes, serve the React app
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});