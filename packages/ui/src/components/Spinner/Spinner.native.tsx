import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { SpinnerProps } from './types';

export function Spinner({
  size = 'medium',
  color,
  testID,
  nativeStyle,
}: SpinnerProps) {
  const theme = useTheme();

  const actualColor = color ?? theme.colors.primary;
  // ActivityIndicator supports 'small' and 'large'
  const rnSize = size === 'small' ? 'small' : 'large';

  return (
    <ActivityIndicator
      testID={testID}
      size={rnSize}
      color={actualColor}
      style={nativeStyle}
    />
  );
}
