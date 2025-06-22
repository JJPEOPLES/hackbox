import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Paper, Button, CircularProgress, Alert, Divider } from '@mui/material';
import { Terminal as TerminalIcon, PlayArrow, Stop, Refresh, Fullscreen, FullscreenExit } from '@mui/icons-material';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import io from 'socket.io-client';
import 'xterm/css/xterm.css';
import axios from 'axios';
import config from '../../config';

const Terminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const socketRef = useRef(null);
  const fitAddonRef = useRef(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vmStatus, setVmStatus] = useState('loading'); // 'loading', 'running', 'stopped', 'starting', 'stopping'
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check VM status
    checkVmStatus();

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  const checkVmStatus = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/vm/status`);
      setVmStatus(response.data.status);
      
      // If VM is running, initialize terminal
      if (response.data.status === 'running' && !xtermRef.current && terminalRef.current) {
        initTerminal();
      }
    } catch (err) {
      console.error('Error checking VM status:', err);
      setError('Failed to check VM status. Please try again later.');
      setVmStatus('stopped');
    }
  };

  const startVm = async () => {
    try {
      setVmStatus('starting');
      const response = await axios.post(`${config.apiUrl}/api/vm/start`);
      
      // With Render.com, the VM is already running with the server
      if (response.data.status === 'running') {
        setVmStatus('running');
        if (!xtermRef.current && terminalRef.current) {
          initTerminal();
        }
      } else {
        // For backward compatibility with the original implementation
        setTimeout(() => {
          setVmStatus('running');
          if (!xtermRef.current && terminalRef.current) {
            initTerminal();
          }
        }, 3000);
      }
    } catch (err) {
      console.error('Error starting VM:', err);
      setError('Failed to start VM. Please try again later.');
      setVmStatus('stopped');
    }
  };

  const stopVm = async () => {
    try {
      setVmStatus('stopping');
      const response = await axios.post(`${config.apiUrl}/api/vm/stop`);
      
      // With Render.com, we can't actually stop the VM separately
      if (response.data.status === 'running') {
        // Just disconnect from the terminal but keep VM status as running
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        setIsConnected(false);
        setVmStatus('running');
        
        // Show a message to the user
        setError('Note: On Render.com, the VM remains running with the server. It will automatically shut down after a period of inactivity.');
      } else {
        // For backward compatibility with the original implementation
        setTimeout(() => {
          setVmStatus('stopped');
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
          setIsConnected(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error stopping VM:', err);
      setError('Failed to stop VM. Please try again later.');
      setVmStatus('running');
    }
  };

  const initTerminal = () => {
    // Initialize xterm.js
    xtermRef.current = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#f0f0f0',
        cursor: '#00ff00',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#e5c07b',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#d0d0d0',
        brightBlack: '#808080',
        brightRed: '#ff5370',
        brightGreen: '#c3e88d',
        brightYellow: '#ffcb6b',
        brightBlue: '#82aaff',
        brightMagenta: '#c792ea',
        brightCyan: '#89ddff',
        brightWhite: '#ffffff'
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      scrollback: 1000,
      allowTransparency: true
    });

    fitAddonRef.current = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    xtermRef.current.loadAddon(fitAddonRef.current);
    xtermRef.current.loadAddon(webLinksAddon);

    // Open terminal
    xtermRef.current.open(terminalRef.current);
    fitAddonRef.current.fit();

    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    // Welcome message
    xtermRef.current.writeln('Welcome to HackBox Terminal!');
    xtermRef.current.writeln('Click "Connect Terminal" to begin your session.');
    xtermRef.current.writeln('');
  };

  const connectToTerminal = () => {
    setIsLoading(true);
    setError(null);
    
    // Connect to socket.io server
    console.log('Connecting to socket server at:', config.socketUrl);
    socketRef.current = io(config.socketUrl, {
      transports: ['websocket', 'polling'], // Try WebSocket first, then fallback to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setIsLoading(false);
      
      xtermRef.current.clear();
      xtermRef.current.writeln('Connected to VM. Starting session...');
      xtermRef.current.writeln('');
    });

    socketRef.current.on('terminal-output', (data) => {
      if (xtermRef.current) {
        xtermRef.current.write(data);
      }
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(`Connection error: ${err.message}. Please check your network connection and try again.`);
      setIsLoading(false);
      setIsConnected(false);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      if (xtermRef.current) {
        xtermRef.current.writeln('');
        xtermRef.current.writeln(`Disconnected from terminal. Reason: ${reason}`);
      }
    });

    // Handle user input
    if (xtermRef.current) {
      xtermRef.current.onData((data) => {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('terminal-input', data);
        }
      });
    }

    // Handle terminal resize
    if (fitAddonRef.current) {
      const dimensions = fitAddonRef.current.proposeDimensions();
      if (dimensions && socketRef.current) {
        socketRef.current.emit('terminal-resize', dimensions);
      }
    }
  };

  const disconnectFromTerminal = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setIsConnected(false);
  };

  const resetTerminal = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln('Terminal reset. Click "Connect Terminal" to begin a new session.');
      xtermRef.current.writeln('');
    }
    
    setIsConnected(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Need to refit the terminal after toggling fullscreen
    setTimeout(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        
        // If connected, send new dimensions to server
        if (isConnected && socketRef.current) {
          const dimensions = fitAddonRef.current.proposeDimensions();
          if (dimensions) {
            socketRef.current.emit('terminal-resize', dimensions);
          }
        }
      }
    }, 100);
  };

  return (
    <Container 
      maxWidth={isFullscreen ? false : "lg"} 
      sx={{ 
        mt: isFullscreen ? 0 : 4, 
        mb: isFullscreen ? 0 : 4,
        p: isFullscreen ? 0 : undefined,
        height: isFullscreen ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {!isFullscreen && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <TerminalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Terminal Session
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Access your Linux VM terminal below. This environment is isolated and secure for practicing Linux commands.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {vmStatus === 'stopped' ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={startVm}
                disabled={vmStatus === 'starting'}
              >
                Start VM
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<Stop />}
                onClick={stopVm}
                disabled={vmStatus === 'stopping'}
              >
                Stop VM
              </Button>
            )}
            
            {vmStatus === 'running' && !isConnected && (
              <Button
                variant="contained"
                color="primary"
                onClick={connectToTerminal}
                disabled={isLoading}
              >
                Connect Terminal
              </Button>
            )}
            
            {isConnected && (
              <Button
                variant="outlined"
                color="error"
                onClick={disconnectFromTerminal}
              >
                Disconnect
              </Button>
            )}
            
            {isLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <div className={`status-dot ${vmStatus}`}></div>
              <Typography variant="body2" sx={{ ml: 1 }}>
                VM: {vmStatus.charAt(0).toUpperCase() + vmStatus.slice(1)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1,
          borderRadius: isFullscreen ? 0 : 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box className="terminal-toolbar">
          <span className="terminal-title">
            {isConnected ? 'Connected to VM' : 'Terminal'}
          </span>
          <Box className="terminal-actions">
            <Button
              size="small"
              onClick={resetTerminal}
              startIcon={<Refresh />}
              sx={{ minWidth: 'auto', color: 'white' }}
            >
              Reset
            </Button>
            <Button
              size="small"
              onClick={toggleFullscreen}
              startIcon={isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              sx={{ minWidth: 'auto', color: 'white' }}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </Box>
        </Box>
        
        <Box 
          ref={terminalRef} 
          sx={{ 
            flexGrow: 1,
            height: isFullscreen ? 'calc(100vh - 40px)' : '500px',
            width: '100%', 
            p: 1,
            bgcolor: '#1e1e1e'
          }}
        />
        
        {vmStatus === 'starting' && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress color="primary" />
              <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                Starting VM...
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
      
      {!isFullscreen && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Note: VM sessions are limited to 30 minutes of inactivity to conserve resources.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Terminal;