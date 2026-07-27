import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import type { ProgressBarProps } from './types';

export function ProgressBar({
  progress = 0,
  indeterminate,
  color,
  testID,
  webStyle,
}: ProgressBarProps) {
  const theme = useTheme();

  const containerStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.full,
    overflow: 'hidden',
    ...webStyle,
  }), [theme, webStyle]);

  const fillStyle = useMemo<React.CSSProperties>(() => {
    if (indeterminate) {
      return {
        width: '50%',
        height: '100%',
        backgroundColor: color ?? theme.colors.primary,
        animation: 'indeterminate 1.5s infinite linear',
      };
    }
    return {
      width: `${Math.max(0, Math.min(100, progress))}%`,
      height: '100%',
      backgroundColor: color ?? theme.colors.primary,
      transition: 'width 0.3s ease-in-out',
    };
  }, [theme, progress, indeterminate, color]);

  return (
    <>
      {indeterminate && (
        <style>{`
          @keyframes indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      )}
      <div style={containerStyle} data-testid={testID} role="progressbar" aria-valuenow={indeterminate ? undefined : progress} aria-valuemin={0} aria-valuemax={100}>
        <div style={fillStyle} />
      </div>
    </>
  );
}
