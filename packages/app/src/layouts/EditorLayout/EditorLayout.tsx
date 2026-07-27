import { Box, Stack, useTheme } from '@imageforge/ui';

export interface EditorLayoutProps {
  toolbar: any;
  leftPanel?: any;
  viewport: any;
  rightPanel?: any;
  bottomActions?: any;
}

export function EditorLayout({ toolbar, leftPanel, viewport, rightPanel, bottomActions }: EditorLayoutProps) {
  const theme = useTheme();

  return (
    <Stack webStyle={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: theme.colors.background }}>
      {/* Top Toolbar */}
      <Box webStyle={{ flexShrink: 0 }}>
        {toolbar}
      </Box>

      {/* Main Content Area */}
      <Stack direction="row" webStyle={{ flex: 1, overflow: 'hidden' }}>
        
        {/* Left Panel */}
        {leftPanel && (
          <Box webStyle={{ width: 300, flexShrink: 0, borderRight: `1px solid ${theme.colors.border}`, overflowY: 'auto' }}>
            {leftPanel}
          </Box>
        )}

        {/* Viewport (Center) */}
        <Box webStyle={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {viewport}
        </Box>

        {/* Right Panel */}
        {rightPanel && (
          <Box webStyle={{ width: 300, flexShrink: 0, borderLeft: `1px solid ${theme.colors.border}`, overflowY: 'auto' }}>
            {rightPanel}
          </Box>
        )}
      </Stack>

      {/* Bottom Actions */}
      {bottomActions && (
        <Box webStyle={{ flexShrink: 0, borderTop: `1px solid ${theme.colors.border}` }}>
          {bottomActions}
        </Box>
      )}
    </Stack>
  );
}
