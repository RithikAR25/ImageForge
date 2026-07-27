import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import type { BadgeProps } from './types';

export function Badge({
  children,
  variant = 'primary',
  testID,
  webStyle,
}: BadgeProps) {
  const theme = useTheme();

  const style = useMemo<React.CSSProperties>(() => {
    let backgroundColor: string = theme.colors.primary;
    if (variant === 'secondary') backgroundColor = theme.colors.secondary;
    if (variant === 'error') backgroundColor = theme.colors.error;
    if (variant === 'success') backgroundColor = theme.colors.success;
    if (variant === 'warning') backgroundColor = theme.colors.warning;

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `2px ${theme.spacing.sm}px`,
      borderRadius: theme.radii.full,
      backgroundColor,
      ...webStyle,
    };
  }, [theme, variant, webStyle]);

  return (
    <span style={style} data-testid={testID}>
      <Text variant="caption" weight="medium" color="#fff">
        {children}
      </Text>
    </span>
  );
}
