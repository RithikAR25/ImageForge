import React from 'react';
import type { BoxProps } from './types';

export function Box({
  children,
  padding,
  margin,
  backgroundColor,
  borderRadius,
  flex,
  width,
  height,
  testID,
  webStyle,
}: BoxProps) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column', // React Native default
    padding,
    margin,
    backgroundColor,
    borderRadius,
    flex,
    width: width as any,
    height: height as any,
    ...webStyle,
  };

  return (
    <div style={style} data-testid={testID}>
      {children}
    </div>
  );
}
