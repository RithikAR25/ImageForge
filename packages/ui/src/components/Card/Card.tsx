import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Box } from '../../layout';
import type { CardProps } from './types';

export function Card({
  children,
  elevation = 'low',
  padding = 'md',
  testID,
  webStyle,
}: CardProps) {
  const theme = useTheme();

  const style = useMemo<React.CSSProperties>(() => {
    let boxShadow = 'none';
    if (elevation === 'low') boxShadow = theme.shadows.sm;
    if (elevation === 'medium') boxShadow = theme.shadows.md;
    if (elevation === 'high') boxShadow = theme.shadows.lg;

    let p = 0;
    if (padding === 'sm') p = theme.spacing.sm;
    if (padding === 'md') p = theme.spacing.md;
    if (padding === 'lg') p = theme.spacing.lg;

    return {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      boxShadow,
      padding: p,
      ...webStyle,
    };
  }, [theme, elevation, padding, webStyle]);

  return (
    <Box webStyle={style} {...(testID ? { testID } : {})}>
      {children}
    </Box>
  );
}
