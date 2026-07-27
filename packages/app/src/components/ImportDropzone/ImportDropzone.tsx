import { useRef } from 'react';
import { Box, Stack, Text, Button, Icon } from '@imageforge/ui';
import { useImport } from '@imageforge/hooks';
import { useTheme } from '@imageforge/ui';

export function ImportDropzone() {
  const { importFiles, isImporting, progress } = useImport();
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  return (
    <Box 
      webStyle={{ 
        border: `2px dashed ${theme.colors.border}`, 
        padding: theme.spacing.xl, 
        textAlign: 'center',
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.surface,
        cursor: isImporting ? 'default' : 'pointer'
      }}
      // @ts-ignore
      onClick={() => {
        if (!isImporting) {
          inputRef.current?.click();
        }
      }}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            importFiles(e.target.files);
            // Reset value so the same file can be selected again
            e.target.value = '';
          }
        }}
      />
      <Stack alignItems="center" gap={theme.spacing.md}>
        <Icon name="upload" size={48} color={theme.colors.text} />
        <Text variant="heading">Drop images here</Text>
        <Text color={theme.colors.secondary}>or</Text>
        <Button 
          label={isImporting ? `Importing... ${progress}%` : "Browse Files"} 
          onPress={() => {
            // Prevent event bubbling if clicked directly
            inputRef.current?.click();
          }} 
          disabled={isImporting} 
        />
      </Stack>
    </Box>
  );
}
