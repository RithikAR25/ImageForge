import { Box, Stack, Text, Card, useTheme } from '@imageforge/ui';
import { useActiveImage } from '@imageforge/hooks';
import { formatFileSize } from '@imageforge/shared';

export function Inspector() {
  const activeImage = useActiveImage();
  const theme = useTheme();

  if (!activeImage) {
    return (
      <Box webStyle={{ padding: theme.spacing.md }}>
        <Text color={theme.colors.secondary}>No image selected</Text>
      </Box>
    );
  }

  return (
    <Stack gap={theme.spacing.md} webStyle={{ height: '100%', overflowY: 'auto', padding: theme.spacing.md }}>
      <Text variant="heading">Properties</Text>
      
      <Card padding="md">
        <Stack gap={theme.spacing.sm}>
          <Box>
            <Text variant="caption" color={theme.colors.secondary}>Name</Text>
            <Text>{activeImage.name}</Text>
          </Box>
          <Box>
            <Text variant="caption" color={theme.colors.secondary}>Format</Text>
            <Text>{activeImage.mimeType.toUpperCase()}</Text>
          </Box>
          <Box>
            <Text variant="caption" color={theme.colors.secondary}>Size</Text>
            <Text>{formatFileSize(activeImage.fileSize)}</Text>
          </Box>
          <Box>
            <Text variant="caption" color={theme.colors.secondary}>Dimensions</Text>
            <Text>{activeImage.width} x {activeImage.height}</Text>
          </Box>
        </Stack>
      </Card>

      {activeImage.exif && Object.keys(activeImage.exif).length > 0 && (
        <Card padding="md">
          <Text weight="medium" webStyle={{ marginBottom: theme.spacing.sm }}>EXIF Data</Text>
          <Stack gap={theme.spacing.xs}>
            {Object.entries(activeImage.exif).slice(0, 10).map(([key, value]) => (
              <Box key={key} webStyle={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text variant="caption" color={theme.colors.secondary}>{key}</Text>
                <Text variant="caption">{String(value)}</Text>
              </Box>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
