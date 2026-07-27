import React, { createContext, useContext, ReactNode } from 'react';
import { tokens, ThemeTokens } from './tokens';

const ThemeContext = createContext<ThemeTokens>(tokens);

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: ThemeTokens; // Allow overriding the default theme
}

export function ThemeProvider({ children, theme = tokens }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
