import type { ReactNode, CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';

export interface CardProps {
  children?: ReactNode;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}
