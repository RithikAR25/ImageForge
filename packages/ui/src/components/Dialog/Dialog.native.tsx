import React from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import { Button } from '../Button';
import { Box, Stack } from '../../layout';
import type { DialogProps, DialogHeaderProps, DialogBodyProps, DialogFooterProps } from './types';

export function Dialog({ open, onClose, children, testID, nativeStyle }: DialogProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.md,
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.lg,
                  padding: theme.spacing.md,
                  width: '100%',
                  maxWidth: 500,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                },
                nativeStyle,
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function DialogHeader({ title, onClose, children, nativeStyle }: DialogHeaderProps) {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" nativeStyle={[{ marginBottom: theme.spacing.md }, nativeStyle]}>
      <Text variant="heading">{title}</Text>
      {onClose && (
        <Button variant="ghost" icon="x" onPress={onClose} label="Close Dialog" />
      )}
      {children}
    </Stack>
  );
}

export function DialogBody({ children, nativeStyle }: DialogBodyProps) {
  return <Box nativeStyle={nativeStyle}>{children}</Box>;
}

export function DialogFooter({ children, nativeStyle }: DialogFooterProps) {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="flex-end" gap={theme.spacing.sm} nativeStyle={[{ marginTop: theme.spacing.md }, nativeStyle]}>
      {children}
    </Stack>
  );
}
