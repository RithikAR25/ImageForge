import type { CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string; // Theme color or raw string
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}
