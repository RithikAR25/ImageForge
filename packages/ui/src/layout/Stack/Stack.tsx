import React from 'react';
import { Box } from '../Box';
import type { StackProps } from './types';

export function Stack({
  direction = 'column',
  gap = 0,
  alignItems,
  justifyContent,
  webStyle,
  ...boxProps
}: StackProps) {
  return (
    <Box
      {...boxProps}
      webStyle={{
        display: 'flex',
        flexDirection: direction,
        gap, // CSS gap works well for web
        alignItems,
        justifyContent,
        ...webStyle,
      }}
    />
  );
}
