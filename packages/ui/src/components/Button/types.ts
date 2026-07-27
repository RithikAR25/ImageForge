import type { ReactNode, CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';
import type { IconName } from '../../icons/types';

export interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  label?: string; // Maps to aria-label or accessibilityLabel
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}
