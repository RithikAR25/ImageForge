import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon } from '../../icons';
import type { SpinnerProps } from './types';

export function Spinner({
  size = 'medium',
  color,
  testID,
  webStyle,
}: SpinnerProps) {
  const theme = useTheme();

  const pxSize = size === 'small' ? 16 : size === 'medium' ? 24 : 32;
  const actualColor = color ?? theme.colors.primary;

  const style = useMemo<React.CSSProperties>(() => ({
    display: 'inline-flex',
    animation: 'spin 1s linear infinite',
    ...webStyle,
  }), [webStyle]);

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={style} data-testid={testID} aria-busy="true" role="progressbar">
        <Icon name="loader" size={pxSize} color={actualColor} />
      </div>
    </>
  );
}
