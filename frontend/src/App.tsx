import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { blue, orange } from '@mui/material/colors';
import HomePage from './pages/HomePage';
import ProteinPage from './pages/ProteinPage';
import NotFoundPage from './pages/NotFoundPage';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: orange[500],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/protein/:proteinId" element={<ProteinPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;