import { Box, Stack, Text, Button, Icon, useTheme } from '@imageforge/ui';
import { useImport } from '@imageforge/hooks';

export function ImportDropzone() {
  const { isImporting, progress } = useImport();
  const theme = useTheme();

  const handlePress = () => {
    // Mobile file picking using expo-image-picker will be implemented in Module 8
    console.warn('Native image picking not yet implemented');
  };

  return (
    <Box 
      nativeStyle={{ 
        borderWidth: 2, 
        borderStyle: 'dashed', 
        borderColor: theme.colors.border, 
        padding: theme.spacing.xl, 
        alignItems: 'center',
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Stack alignItems="center" gap={theme.spacing.md}>
        <Icon name="upload" size={48} color={theme.colors.text} />
        <Text variant="heading">Tap to select images</Text>
        <Button 
          label={isImporting ? `Importing... ${progress}%` : "Browse Files"} 
          onPress={handlePress} 
          disabled={isImporting} 
        />
      </Stack>
    </Box>
  );
}
