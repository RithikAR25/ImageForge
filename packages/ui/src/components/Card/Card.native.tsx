import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Box } from '../../layout';
import type { CardProps } from './types';

export function Card({
  children,
  elevation = 'low',
  padding = 'md',
  testID,
  nativeStyle,
}: CardProps) {
  const theme = useTheme();

  const style = useMemo(() => {
    // Basic shadow approximation for RN
    let shadowColor = '#000';
    let shadowOffset = { width: 0, height: 1 };
    let shadowOpacity = 0;
    let shadowRadius = 0;
    let elevationProp = 0; // Android elevation

    if (elevation === 'low') {
      shadowOpacity = 0.12;
      shadowRadius = 2;
      elevationProp = 2;
    } else if (elevation === 'medium') {
      shadowOffset = { width: 0, height: 2 };
      shadowOpacity = 0.15;
      shadowRadius = 4;
      elevationProp = 4;
    } else if (elevation === 'high') {
      shadowOffset = { width: 0, height: 4 };
      shadowOpacity = 0.2;
      shadowRadius = 8;
      elevationProp = 8;
    }

    let p = 0;
    if (padding === 'sm') p = theme.spacing.sm;
    if (padding === 'md') p = theme.spacing.md;
    if (padding === 'lg') p = theme.spacing.lg;

    return {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      padding: p,
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation: elevationProp,
    };
  }, [theme, elevation, padding]);

  return (
    <Box nativeStyle={[style, nativeStyle]} {...(testID ? { testID } : {})}>
      {children}
    </Box>
  );
}
