import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Terminal as TerminalIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import axios from 'axios';
import config from '../../config';

const Dashboard = () => {
  const [vmStatus, setVmStatus] = useState('loading'); // 'loading', 'running', 'stopped', 'starting', 'stopping'
  const [vmInfo, setVmInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVmStatus();
  }, []);

  const fetchVmStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/api/vm/status`);
      setVmStatus(response.data.status);
      setVmInfo(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching VM status:', err);
      setError('Failed to fetch VM status. Please try again later.');
      setVmStatus('stopped');
      setLoading(false);
    }
  };

  const startVm = async () => {
    try {
      setVmStatus('starting');
      const response = await axios.post(`${config.apiUrl}/api/vm/start`);
      
      // With Render.com, the VM is already running with the server
      if (response.data.status === 'running') {
        setVmStatus('running');
        setVmInfo({
          ...vmInfo,
          status: 'running',
          uptime: response.data.uptime || 'Since server start',
          provider: 'Render.com'
        });
      } else {
        // For backward compatibility with the original implementation
        setTimeout(() => {
          setVmStatus('running');
          setVmInfo({
            ...vmInfo,
            status: 'running',
            uptime: '0m'
          });
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
        // Just update the UI to show it's still running
        setVmStatus('running');
        setVmInfo({
          ...vmInfo,
          status: 'running',
          note: 'On Render.com, the VM stops automatically when the server is inactive'
        });
        
        // Show a message to the user
        setError('Note: On Render.com, the VM remains running with the server. It will automatically shut down after a period of inactivity.');
      } else {
        // For backward compatibility with the original implementation
        setTimeout(() => {
          setVmStatus('stopped');
          setVmInfo({
            ...vmInfo,
            status: 'stopped',
            uptime: '0m'
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Error stopping VM:', err);
      setError('Failed to stop VM. Please try again later.');
      setVmStatus('running');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="dashboard-container">
      <Box className="header-container">
        <Typography variant="h4" component="h1" gutterBottom>
          Linux VM Dashboard
        </Typography>
        <Box className="status-indicator">
          <div className={`status-dot ${vmStatus}`}></div>
          <Typography variant="body1">
            Status: {vmStatus.charAt(0).toUpperCase() + vmStatus.slice(1)}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box className="vm-controls">
        {vmStatus === 'stopped' ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={startVm}
            disabled={vmStatus === 'starting'}
          >
            Start VM
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={stopVm}
            disabled={vmStatus === 'stopping' || vmStatus === 'stopped'}
          >
            Stop VM
          </Button>
        )}
        <Button
          variant="outlined"
          component={RouterLink}
          to="/terminal"
          startIcon={<TerminalIcon />}
          disabled={vmStatus !== 'running'}
        >
          Open Terminal
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              VM Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {vmInfo ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">IP Address:</Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {vmInfo.ip}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Memory:</Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {vmInfo.memory}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Uptime:</Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {vmInfo.uptime}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No VM information available
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<TerminalIcon />}
                  component={RouterLink}
                  to="/terminal"
                  disabled={vmStatus !== 'running'}
                  fullWidth
                >
                  Terminal
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MemoryIcon />}
                  disabled={vmStatus !== 'running'}
                  fullWidth
                >
                  System Monitor
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<StorageIcon />}
                  disabled={vmStatus !== 'running'}
                  fullWidth
                >
                  File Browser
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              VM Usage Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              This Linux VM is running with 512MB of RAM and is suitable for basic command-line operations and learning Linux.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Getting Started:</strong>
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  Start the VM using the controls above
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Open the terminal to access the command line
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Use standard Linux commands to navigate and operate the system
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Remember to stop the VM when you're done to save resources
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// Helper component for the grid layout
const Grid = ({ container, item, xs, md, spacing, children, ...props }) => {
  if (container) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: spacing ? `-${spacing * 4}px` : 0,
          ...props.sx
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
  
  if (item) {
    return (
      <Box
        sx={{
          flexGrow: 0,
          maxWidth: xs === 12 ? '100%' : md === 8 ? '66.666667%' : md === 4 ? '33.333333%' : '100%',
          flexBasis: xs === 12 ? '100%' : md === 8 ? '66.666667%' : md === 4 ? '33.333333%' : '100%',
          padding: spacing ? `${spacing * 4}px` : 0,
          ...props.sx
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
  
  return <Box {...props}>{children}</Box>;
};

export default Dashboard;