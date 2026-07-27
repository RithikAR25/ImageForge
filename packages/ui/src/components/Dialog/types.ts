import type { ReactNode, CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  testID?: string;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}

export interface DialogHeaderProps {
  children?: ReactNode;
  title: string;
  onClose?: () => void;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}

export interface DialogBodyProps {
  children?: ReactNode;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}

export interface DialogFooterProps {
  children?: ReactNode;
  webStyle?: CSSProperties;
  nativeStyle?: ViewStyle;
}
