import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@imageforge/ui';
import { ImageForgeProvider } from '@imageforge/hooks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRouter } from './router/routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ImageForgeProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ImageForgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
