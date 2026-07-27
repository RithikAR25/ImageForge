import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import type { BadgeProps } from './types';

export function Badge({
  children,
  variant = 'primary',
  testID,
  nativeStyle,
}: BadgeProps) {
  const theme = useTheme();

  const style = useMemo(() => {
    let backgroundColor: string = theme.colors.primary;
    if (variant === 'secondary') backgroundColor = theme.colors.secondary;
    if (variant === 'error') backgroundColor = theme.colors.error;
    if (variant === 'success') backgroundColor = theme.colors.success;
    if (variant === 'warning') backgroundColor = theme.colors.warning;

    return {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 2,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radii.full,
      backgroundColor,
      alignSelf: 'flex-start' as const,
    };
  }, [theme, variant]);

  return (
    <View style={[style, nativeStyle]} testID={testID}>
      <Text variant="caption" weight="medium" color="#fff">
        {children}
      </Text>
    </View>
  );
}
