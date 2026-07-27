import React, { useMemo } from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { TextProps } from './types';

export function Text({
  children,
  variant = 'body',
  weight = 'regular',
  color,
  align,
  numberOfLines,
  testID,
  nativeStyle,
}: TextProps) {
  const theme = useTheme();

  const style = useMemo(() => {
    let fontSize: number = theme.typography.sizes.md;
    if (variant === 'heading') fontSize = theme.typography.sizes.xl;
    if (variant === 'caption') fontSize = theme.typography.sizes.sm;

    let fontWeight: any = theme.typography.weights.regular;
    if (weight === 'medium') fontWeight = theme.typography.weights.medium;
    if (weight === 'bold') fontWeight = theme.typography.weights.bold;

    return {
      fontSize,
      fontWeight,
      color: color ?? theme.colors.text,
      textAlign: align,
    };
  }, [theme, variant, weight, color, align]);

  return (
    <RNText
      testID={testID}
      numberOfLines={numberOfLines}
      style={[style, nativeStyle]}
    >
      {children}
    </RNText>
  );
}
