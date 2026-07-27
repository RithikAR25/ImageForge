import React from 'react';
import { Stack, Button, Text, useTheme } from '@imageforge/ui';
import { useActiveImage } from '@imageforge/hooks';

export interface EditorToolbarProps {
  title: string;
  onApply: () => void;
  onCancel: () => void;
  isApplying?: boolean;
}

export function EditorToolbar({ title, onApply, onCancel, isApplying }: EditorToolbarProps) {
  const activeImage = useActiveImage();
  const theme = useTheme();

  return (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center" 
      webStyle={{ 
        padding: theme.spacing.md,
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface
      }}
    >
      <Stack direction="row" alignItems="center" gap={theme.spacing.md}>
        <Button variant="ghost" icon="x" onPress={onCancel} label="Cancel" />
        <Text variant="heading">{title}</Text>
      </Stack>

      <Stack direction="row" alignItems="center" gap={theme.spacing.md}>
        <Text color={theme.colors.secondary}>
          {activeImage ? activeImage.name : 'No image'}
        </Text>
        <Button 
          variant="primary" 
          icon="check" 
          onPress={onApply} 
          disabled={!!(!activeImage || isApplying)} 
          label={isApplying ? 'Applying...' : 'Apply'} 
        />
      </Stack>
    </Stack>
  );
}
