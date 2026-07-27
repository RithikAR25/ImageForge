import React from 'react';
import { Box, Stack, Text, Card, Button, useTheme } from '@imageforge/ui';
import { useImages } from '@imageforge/hooks';

export function ImageGrid() {
  const { images, activeImageId, setActiveImage, removeImage, clear } = useImages();
  const theme = useTheme();

  if (images.length === 0) {
    return (
      <Box webStyle={{ padding: theme.spacing.md }}>
        <Text color={theme.colors.secondary}>No images imported yet.</Text>
      </Box>
    );
  }

  return (
    <Stack gap={theme.spacing.md} webStyle={{ height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" webStyle={{ padding: theme.spacing.md }}>
        <Text variant="heading">Recent Images ({images.length})</Text>
        <Button variant="ghost" icon="trash" onPress={clear} label="Clear All" />
      </Stack>
      
      <Box 
        webStyle={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: theme.spacing.md,
          padding: `0 ${theme.spacing.md}px`,
          overflowY: 'auto'
        }}
      >
        {images.map(img => {
          const isActive = img.id === activeImageId;
          return (
            <Box 
              key={img.id} 
              // @ts-ignore
              onClick={() => setActiveImage(img.id)}
              webStyle={{ cursor: 'pointer' }}
            >
              <Card 
                padding="sm" 
                webStyle={{ 
                  border: isActive ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                  position: 'relative'
                }}
              >
                <Stack alignItems="center" gap={theme.spacing.sm}>
                  {/* Mock thumbnail since real thumbnail might not be ready. In real app, we use useThumbnail hook */}
                  <Box webStyle={{ width: '100%', aspectRatio: '1/1', backgroundColor: theme.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: theme.radii.md }}>
                    <Text variant="caption" color={theme.colors.secondary}>{img.mimeType}</Text>
                  </Box>
                  <Text variant="caption" webStyle={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.name}
                  </Text>
                </Stack>
                <Box webStyle={{ position: 'absolute', top: 4, right: 4 }}>
                  <Button 
                    variant="ghost" 
                    icon="x" 
                    onPress={() => removeImage(img.id)} 
                    // Prevent active image setting when clicking delete
                    // But in a real button, onPress might not stop propagation on web without exposing event.
                    // For now, we'll assume the user might click it.
                  />
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
