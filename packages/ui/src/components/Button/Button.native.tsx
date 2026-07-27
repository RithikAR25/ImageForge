import React, { useMemo } from 'react';
import { Pressable, Text as RNText } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon } from '../../icons';
import { Spinner } from '../Spinner';
import type { ButtonProps } from './types';

export function Button({
  children,
  variant = 'primary',
  onPress,
  disabled,
  loading,
  icon,
  label,
  testID,
  nativeStyle,
}: ButtonProps) {
  const theme = useTheme();

  const { buttonStyle, textStyle } = useMemo(() => {
    let backgroundColor: string = theme.colors.primary;
    let color: string = '#fff';
    let borderWidth = 0;
    let borderColor = 'transparent';

    if (variant === 'secondary') {
      backgroundColor = theme.colors.secondary;
    } else if (variant === 'outline') {
      backgroundColor = 'transparent';
      color = theme.colors.primary;
      borderWidth = 1;
      borderColor = theme.colors.primary;
    } else if (variant === 'ghost') {
      backgroundColor = 'transparent';
      color = theme.colors.primary;
    }

    if (disabled || loading) {
      backgroundColor = theme.colors.border;
      color = theme.colors.textMuted;
    }

    return {
      buttonStyle: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.md,
        backgroundColor,
        borderWidth,
        borderColor,
      },
      textStyle: {
        color,
        fontSize: theme.typography.sizes.md,
        fontWeight: '500' as const,
      }
    };
  }, [theme, variant, disabled, loading]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      testID={testID}
      style={[buttonStyle, nativeStyle]}
    >
      {loading ? <Spinner size="small" color={textStyle.color} /> : icon ? <Icon name={icon} size={18} color={textStyle.color} /> : null}
      {children && <RNText style={textStyle}>{children}</RNText>}
    </Pressable>
  );
}
