import type { ReactNode, CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';

export interface BadgeProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}
