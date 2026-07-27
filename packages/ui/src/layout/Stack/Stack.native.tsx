import React from 'react';
import { Box } from '../Box';
import type { StackProps } from './types';

export function Stack({
  direction = 'column',
  gap = 0,
  alignItems,
  justifyContent,
  nativeStyle,
  ...boxProps
}: StackProps) {
  return (
    <Box
      {...boxProps}
      nativeStyle={[
        {
          flexDirection: direction,
          gap, // React Native >= 0.71 supports gap!
          alignItems,
          justifyContent,
        },
        nativeStyle,
      ]}
    />
  );
}
