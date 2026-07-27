import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@imageforge/ui';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { useKeyboardShortcuts } from '../services/shortcuts';

export function AppLayout() {
  const theme = useTheme();
  useKeyboardShortcuts();
  
  return (
    <Box webStyle={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden',
      backgroundColor: theme.colors.background,
      color: theme.colors.text
    }}>
      <Sidebar />
      <Box webStyle={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <TopBar />
        <Box webStyle={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
