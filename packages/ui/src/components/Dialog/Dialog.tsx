import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { Button } from '../Button';
import { Box, Stack } from '../../layout';
import type { DialogProps, DialogHeaderProps, DialogBodyProps, DialogFooterProps } from './types';

export function Dialog({ open, onClose, children, testID, webStyle }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (open) {
      dialogNode?.showModal();
    } else {
      dialogNode?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      data-testid={testID}
      style={{
        padding: 0,
        border: 'none',
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.surface,
        boxShadow: theme.shadows.lg,
        maxWidth: '500px',
        width: '100%',
        ...webStyle,
      }}
    >
      <Box webStyle={{ padding: theme.spacing.md }}>
        <Stack gap={theme.spacing.md}>
          {children}
        </Stack>
      </Box>
    </dialog>
  );
}

export function DialogHeader({ title, onClose, children, webStyle }: DialogHeaderProps) {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" {...(webStyle ? { webStyle } : {})}>
      <Text variant="heading">{title}</Text>
      {onClose && (
        <Button variant="ghost" icon="x" onPress={onClose} label="Close Dialog" />
      )}
      {children}
    </Stack>
  );
}

export function DialogBody({ children, webStyle }: DialogBodyProps) {
  return <Box {...(webStyle ? { webStyle } : {})}>{children}</Box>;
}

export function DialogFooter({ children, webStyle }: DialogFooterProps) {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="flex-end" gap={theme.spacing.sm} {...(webStyle ? { webStyle } : {})}>
      {children}
    </Stack>
  );
}
