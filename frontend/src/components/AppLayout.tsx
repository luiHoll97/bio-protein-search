import React from 'react';
import { AppBar, Box, Container, Toolbar, Typography, CssBaseline } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Global, css } from '@emotion/react';

const theme = createTheme();

const globalStyles = css`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        margin: 0,
        padding: 0,
      }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              textDecoration: 'none', 
              color: 'white',
              flexGrow: 1
            }}>
              Biographica Protein Info
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box component="main" sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {children}
        </Box>
        
        <Box component="footer" sx={{ 
          py: 3, 
          px: 2, 
          backgroundColor: (theme) => theme.palette.grey[100],
          mt: 'auto', // LUI_FE push to bottom
        }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              Biographica Protein Info
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {new Date().getFullYear()} - Lui Holliday (T-Test)
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;