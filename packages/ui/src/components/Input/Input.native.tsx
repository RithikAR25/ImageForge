import React, { useMemo } from 'react';
import { TextInput, View } from 'react-native';
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
  nativeStyle,
}: InputProps) {
  const theme = useTheme();

  const containerStyle = {
    flexDirection: 'column' as const,
    gap: theme.spacing.xs,
    width: '100%' as const,
  };

  const inputStyle = useMemo(() => ({
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    backgroundColor: disabled ? theme.colors.surface : theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.md,
  }), [theme, error, disabled]);

  const secureTextEntry = type === 'password';
  const keyboardType = type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';

  return (
    <View style={containerStyle}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        testID={testID}
        // @ts-ignore RN types are missing this on TextInput
        accessibilityState={{ invalid: !!error }}
        style={[inputStyle, nativeStyle]}
      />
      {error && (
        <Text variant="caption" color={theme.colors.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
