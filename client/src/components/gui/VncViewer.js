import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { Computer, Refresh, Fullscreen, FullscreenExit } from '@mui/icons-material';
import axios from 'axios';
import config from '../../config';

const VncViewer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vmStatus, setVmStatus] = useState('loading');
  const [vncUrl, setVncUrl] = useState('');
  const [vncPassword, setVncPassword] = useState('');

  useEffect(() => {
    // Check VM status and get VNC details
    checkVmStatus();
  }, []);

  const checkVmStatus = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/vm/status`);
      setVmStatus(response.data.status);
      
      if (response.data.status === 'running') {
        // Get VNC details
        try {
          const vncResponse = await axios.get(`${config.apiUrl}/api/vm/vnc`);
          setVncUrl(vncResponse.data.url);
          setVncPassword(vncResponse.data.password);
        } catch (err) {
          console.error('Error getting VNC details:', err);
          setError('VNC is not available. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error checking VM status:', err);
      setError('Failed to check VM status. Please try again later.');
      setVmStatus('stopped');
      setIsLoading(false);
    }
  };

  const startVm = async () => {
    try {
      setVmStatus('starting');
      setIsLoading(true);
      const response = await axios.post(`${config.apiUrl}/api/vm/start`);
      
      if (response.data.status === 'running') {
        setVmStatus('running');
        // Get VNC details
        try {
          const vncResponse = await axios.get(`${config.apiUrl}/api/vm/vnc`);
          setVncUrl(vncResponse.data.url);
          setVncPassword(vncResponse.data.password);
        } catch (err) {
          console.error('Error getting VNC details:', err);
          setError('VNC is not available. Please try again later.');
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error starting VM:', err);
      setError('Failed to start VM. Please try again later.');
      setVmStatus('stopped');
      setIsLoading(false);
    }
  };

  const stopVm = async () => {
    try {
      setVmStatus('stopping');
      setIsLoading(true);
      const response = await axios.post(`${config.apiUrl}/api/vm/stop`);
      
      if (response.data.status === 'running') {
        // Just show a message to the user
        setError('Note: On Render.com, the VM remains running with the server. It will automatically shut down after a period of inactivity.');
        setVmStatus('running');
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error stopping VM:', err);
      setError('Failed to stop VM. Please try again later.');
      setVmStatus('running');
      setIsLoading(false);
    }
  };

  const refreshVnc = () => {
    setIsLoading(true);
    setError(null);
    checkVmStatus();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Render a message if VNC is not available
  const renderVncUnavailable = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      p: 3
    }}>
      <Typography variant="h5" gutterBottom>
        GUI Access Not Available
      </Typography>
      <Typography variant="body1" paragraph align="center">
        The GUI interface is not currently available on this deployment.
      </Typography>
      <Typography variant="body1" paragraph align="center">
        To enable GUI access, the server needs to be configured with VNC support.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => window.location.href = '/terminal'}
      >
        Go to Terminal
      </Button>
    </Box>
  );

  // Render a placeholder for the VNC viewer
  // In a real implementation, you would integrate with a VNC client library
  const renderVncViewer = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      p: 3
    }}>
      <Typography variant="h5" gutterBottom>
        GUI Access Coming Soon
      </Typography>
      <Typography variant="body1" paragraph align="center">
        The GUI interface is under development and will be available soon.
      </Typography>
      <Typography variant="body1" paragraph align="center">
        In the meantime, you can use the terminal to interact with the VM.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => window.location.href = '/terminal'}
      >
        Go to Terminal
      </Button>
    </Box>
  );

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
            <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
            GUI Access
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Access your Linux VM graphical interface below. This environment provides a full desktop experience.
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
                onClick={startVm}
                disabled={vmStatus === 'starting'}
              >
                Start VM
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={stopVm}
                disabled={vmStatus === 'stopping'}
              >
                Stop VM
              </Button>
            )}
            
            <Button
              variant="outlined"
              onClick={refreshVnc}
              startIcon={<Refresh />}
              disabled={isLoading}
            >
              Refresh
            </Button>
            
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
          flexDirection: 'column',
          minHeight: '500px'
        }}
      >
        <Box className="vnc-toolbar" sx={{ 
          bgcolor: '#1e1e1e', 
          color: 'white',
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span className="vnc-title">
            {vmStatus === 'running' ? 'VM Desktop' : 'VM Desktop (Not Running)'}
          </span>
          <Box className="vnc-actions">
            <Button
              size="small"
              onClick={refreshVnc}
              startIcon={<Refresh />}
              sx={{ minWidth: 'auto', color: 'white' }}
            >
              Refresh
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
          sx={{ 
            flexGrow: 1,
            height: isFullscreen ? 'calc(100vh - 40px)' : '500px',
            width: '100%', 
            bgcolor: '#f0f0f0',
            position: 'relative'
          }}
        >
          {isLoading ? (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <CircularProgress />
            </Box>
          ) : (
            vncUrl ? renderVncViewer() : renderVncUnavailable()
          )}
        </Box>
      </Paper>
      
      {!isFullscreen && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Note: GUI sessions are resource-intensive. Please close the session when not in use.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default VncViewer;