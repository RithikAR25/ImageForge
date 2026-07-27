import React, { useMemo } from 'react';
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
  webStyle,
}: TextProps) {
  const theme = useTheme();

  const style = useMemo<React.CSSProperties>(() => {
    let fontSize: number = theme.typography.sizes.md;
    if (variant === 'heading') fontSize = theme.typography.sizes.xl;
    if (variant === 'caption') fontSize = theme.typography.sizes.sm;

    let fontWeight: any = theme.typography.weights.regular;
    if (weight === 'medium') fontWeight = theme.typography.weights.medium;
    if (weight === 'bold') fontWeight = theme.typography.weights.bold;

    return {
      fontFamily: theme.typography.fontFamily,
      fontSize,
      fontWeight,
      color: color ?? theme.colors.text,
      textAlign: align as any,
      margin: 0,
      ...(numberOfLines && {
        display: '-webkit-box',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }),
      ...webStyle,
    };
  }, [theme, variant, weight, color, align, numberOfLines, webStyle]);

  const Tag = variant === 'heading' ? 'h2' : variant === 'caption' ? 'span' : 'p';

  return (
    <Tag style={style} data-testid={testID}>
      {children}
    </Tag>
  );
}
