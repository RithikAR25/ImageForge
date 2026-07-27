import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  nativeStyle,
}: BoxProps) {
  return (
    <View
      testID={testID}
      style={[
        {
          padding,
          margin,
          backgroundColor,
          borderRadius,
          flex,
          width,
          height,
        },
        nativeStyle,
      ]}
    >
      {children}
    </View>
  );
}
