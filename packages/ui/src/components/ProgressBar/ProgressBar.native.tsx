import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { ProgressBarProps } from './types';

export function ProgressBar({
  progress = 0,
  indeterminate,
  color,
  testID,
  nativeStyle,
}: ProgressBarProps) {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const indeterminateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.timing(indeterminateValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      ).start();
    } else {
      indeterminateValue.stopAnimation();
      Animated.timing(animatedValue, {
        toValue: Math.max(0, Math.min(100, progress)),
        duration: 300,
        useNativeDriver: false, // width can't use native driver usually
      }).start();
    }
  }, [progress, indeterminate, animatedValue, indeterminateValue]);

  const containerStyle = {
    width: '100%' as const,
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.full,
    overflow: 'hidden' as const,
  };

  const actualColor = color ?? theme.colors.primary;

  if (indeterminate) {
    const translateX = indeterminateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['-100%', '200%'],
    });
    return (
      <View testID={testID} style={[containerStyle, nativeStyle]} accessibilityRole="progressbar">
        <Animated.View
          style={{
            width: '50%',
            height: '100%',
            backgroundColor: actualColor,
            transform: [{ translateX }],
          }}
        />
      </View>
    );
  }

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View testID={testID} style={[containerStyle, nativeStyle]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }}>
      <Animated.View
        style={{
          width,
          height: '100%',
          backgroundColor: actualColor,
        }}
      />
    </View>
  );
}
