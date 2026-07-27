import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Text, Button, Stack } from '@imageforge/ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box webStyle={{ 
          height: '100vh', 
          width: '100vw', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <Stack alignItems="center" gap={16}>
            <Text variant="heading">Something went wrong</Text>
            <Text>{this.state.error?.message}</Text>
            <Button 
              label="Reload Application" 
              onPress={() => window.location.reload()} 
              variant="primary" 
            />
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}
