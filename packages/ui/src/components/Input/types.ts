import type { CSSProperties } from 'react';
import type { TextStyle } from 'react-native';

export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: TextStyle;
}
