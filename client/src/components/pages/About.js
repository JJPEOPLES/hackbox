import React from 'react';
import { Container, Typography, Box, Paper, Divider, Link } from '@mui/material';
import { Terminal as TerminalIcon, Info as InfoIcon } from '@mui/icons-material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        About HackBox
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          What is HackBox?
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          HackBox is a web-based platform that provides access to a lightweight Linux virtual machine (VM) through your browser. 
          It's designed to help users learn Linux commands, practice system administration, and explore cybersecurity concepts in a safe, isolated environment.
        </Typography>
        <Typography variant="body1" paragraph>
          The platform connects to a VM hosted on fly.io, allowing you to access a full Linux environment without installing anything on your local machine.
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Features
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Web-based Terminal:</strong> Access a full Linux terminal directly in your browser
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Lightweight VM:</strong> Runs on a 512MB RAM Alpine Linux instance
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Persistent Environment:</strong> Your VM state is preserved between sessions
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Resource Efficient:</strong> Automatically stops after periods of inactivity to save resources
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Getting Started
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          <strong>1. Start the VM:</strong> From the Dashboard, click the "Start VM" button to initialize your Linux environment.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>2. Open Terminal:</strong> Once the VM is running, navigate to the Terminal page or click "Open Terminal" from the Dashboard.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>3. Connect:</strong> Click "Connect Terminal" to establish a connection to your VM.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>4. Start Learning:</strong> Use standard Linux commands to navigate and operate the system.
        </Typography>
        <Typography variant="body1">
          <strong>5. When Finished:</strong> Remember to stop your VM when you're done to conserve resources.
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Technical Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          <strong>VM Specifications:</strong>
        </Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography variant="body1">• Operating System: Alpine Linux</Typography>
          <Typography variant="body1">• Memory: 512MB RAM</Typography>
          <Typography variant="body1">• CPU: 1 shared vCPU</Typography>
          <Typography variant="body1">• Storage: 1GB</Typography>
          <Typography variant="body1">• Hosting: fly.io</Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          <strong>Technologies Used:</strong>
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography variant="body1">• Frontend: React, Material-UI, xterm.js</Typography>
          <Typography variant="body1">• Backend: Node.js, Express, Socket.IO</Typography>
          <Typography variant="body1">• Containerization: Docker</Typography>
          <Typography variant="body1">• Cloud Platform: fly.io</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;