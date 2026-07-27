import type { CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';

export interface ProgressBarProps {
  progress?: number; // 0 to 100
  indeterminate?: boolean;
  color?: string; // e.g. theme.colors.primary
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}
