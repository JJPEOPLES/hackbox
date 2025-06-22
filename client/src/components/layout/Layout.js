import React from 'react';
import { Box, Container } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {children}
      </Box>
    </Container>
  );
};

export default Layout;