import type { ReactNode, CSSProperties } from 'react';
import type { TextStyle } from 'react-native';

export interface TextProps {
  children?: ReactNode;
  variant?: 'heading' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'bold';
  color?: string; // e.g. theme.colors.text
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: TextStyle;
}
