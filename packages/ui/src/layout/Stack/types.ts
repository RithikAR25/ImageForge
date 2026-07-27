import type { BoxProps } from '../Box';

export interface StackProps extends BoxProps {
  direction?: 'row' | 'column';
  gap?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}
