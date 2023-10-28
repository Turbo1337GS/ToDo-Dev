import React, { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface DarkProps {
  children: ReactNode;
}

const Dark: React.FC<DarkProps> = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body, button, input, textarea, select {
            font-family: 'Poppins', sans-serif;
          }
        `
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Dark;
