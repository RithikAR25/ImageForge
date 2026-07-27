import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../Text';
import type { InputProps } from './types';

export function Input({
  value,
  onChangeText,
  placeholder,
  disabled,
  error,
  type = 'text',
  testID,
  webStyle,
}: InputProps) {
  const theme = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: '100%',
  };

  const inputStyle = useMemo<React.CSSProperties>(() => ({
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.radii.md,
    border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
    backgroundColor: disabled ? theme.colors.surface : theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily,
    outline: 'none',
    transition: theme.animation.fast,
    cursor: disabled ? 'not-allowed' : 'text',
    ...webStyle,
  }), [theme, error, disabled, webStyle]);

  return (
    <div style={containerStyle}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChangeText?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-errormessage={error ? `${testID}-error` : undefined}
        data-testid={testID}
        style={inputStyle}
      />
      {error && (
        <Text variant="caption" color={theme.colors.error} testID={`${testID}-error`}>
          {error}
        </Text>
      )}
    </div>
  );
}
