export type IconName =
  | 'rotate-cw'
  | 'crop'
  | 'image'
  | 'settings'
  | 'undo'
  | 'redo'
  | 'download'
  | 'upload'
  | 'trash'
  | 'x'
  | 'check'
  | 'plus'
  | 'minus'
  | 'zoom-in'
  | 'zoom-out'
  | 'loader';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}
