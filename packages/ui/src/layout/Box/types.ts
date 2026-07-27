import type { ReactNode, CSSProperties } from 'react';
import type { StyleProp, ViewStyle, DimensionValue } from 'react-native';

export interface BoxProps {
  children?: ReactNode;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  borderRadius?: number;
  flex?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  testID?: string;
  // We allow platform-specific style overrides as an escape hatch, but ideally use the typed props.
  webStyle?: CSSProperties;
  nativeStyle?: StyleProp<ViewStyle>;
}
