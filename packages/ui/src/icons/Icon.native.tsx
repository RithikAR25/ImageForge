import React from 'react';
import {
  RotateCw,
  Crop,
  Image as ImageIcon,
  Settings,
  Undo,
  Redo,
  Download,
  Upload,
  Trash,
  X,
  Check,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  Loader2,
  LucideIcon
} from 'lucide-react-native';
import type { IconName, IconProps } from './types';

const iconMap: Record<IconName, LucideIcon> = {
  'rotate-cw': RotateCw,
  'crop': Crop,
  'image': ImageIcon,
  'settings': Settings,
  'undo': Undo,
  'redo': Redo,
  'download': Download,
  'upload': Upload,
  'trash': Trash,
  'x': X,
  'check': Check,
  'plus': Plus,
  'minus': Minus,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  'loader': Loader2,
};

export function Icon({ name, size = 24, color = '#000', className }: IconProps) {
  const Component = iconMap[name] as any;
  if (!Component) return null;
  // className is typically ignored in RN unless using a tool like NativeWind.
  return <Component size={size} color={color} />;
}
