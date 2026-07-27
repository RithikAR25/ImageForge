import React, { useMemo } from 'react';
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
  webStyle,
}: ButtonProps) {
  const theme = useTheme();

  const style = useMemo<React.CSSProperties>(() => {
    let backgroundColor: string = theme.colors.primary;
    let color: string = '#fff';
    let border = 'none';

    if (variant === 'secondary') {
      backgroundColor = theme.colors.secondary;
    } else if (variant === 'outline') {
      backgroundColor = 'transparent';
      color = theme.colors.primary;
      border = `1px solid ${theme.colors.primary}`;
    } else if (variant === 'ghost') {
      backgroundColor = 'transparent';
      color = theme.colors.primary;
    }

    if (disabled || loading) {
      backgroundColor = theme.colors.border;
      color = theme.colors.textMuted;
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      borderRadius: theme.radii.md,
      backgroundColor,
      color,
      border,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      fontSize: theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      transition: theme.animation.fast,
      ...webStyle,
    };
  }, [theme, variant, disabled, loading, webStyle]);

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      aria-label={label}
      data-testid={testID}
      style={style}
    >
      {loading ? <Spinner size="small" color={style.color as string} /> : icon ? <Icon name={icon} size={18} /> : null}
      {children && <span>{children}</span>}
    </button>
  );
}
