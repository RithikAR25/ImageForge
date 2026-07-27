import React, { useState } from 'react';
import { EditorLayout } from '../../layouts/EditorLayout';
import { EditorToolbar } from '../../components/EditorToolbar';
import { Box, Stack, Text, Card, useTheme, Input } from '@imageforge/ui';
import { useActiveImage, useImageProcessor } from '@imageforge/hooks';
import type { ProcessingOperation, ResizeConfig, ImageFile, ProcessingResult } from '@imageforge/types';
import { imageStore, historyStore } from '@imageforge/shared';

export interface ResizeScreenProps {
  onBack: () => void;
}

export function ResizeScreen({ onBack }: ResizeScreenProps): JSX.Element {
  const activeImage = useActiveImage();
  const { process, isProcessing, error } = useImageProcessor();
  const theme = useTheme();

  const [width, setWidth] = useState(activeImage?.width.toString() ?? '1920');
  const [height, setHeight] = useState(activeImage?.height.toString() ?? '1080');

  const handleApply = () => {
    if (!activeImage) return;

    const op: ProcessingOperation = {
      type: 'resize',
      config: {
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        maintainAspectRatio: true,
        mode: 'fit',
        algorithm: 'bicubic',
      } as ResizeConfig,
    };

    const beforeSnapshot = { ...activeImage };
    
    process(activeImage, [op]).then((result: ProcessingResult) => {
      const newImage: ImageFile = {
        ...activeImage,
        fileSize: result.outputSize,
        width: parseInt(width, 10), 
        height: parseInt(height, 10),
      };
      
      imageStore.getState().updateImage(activeImage.id, newImage);
      historyStore.getState().push({
        id: Date.now().toString(),
        imageId: activeImage.id,
        operation: op,
        beforeSnapshot,
        afterSnapshot: newImage,
        timestamp: new Date()
      });

      onBack();
    }).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Resize failed', err);
    });
  };

  const toolbar = <EditorToolbar title="Resize" onApply={handleApply} onCancel={onBack} isApplying={isProcessing} />;

  const leftPanel = (
    <Stack gap={theme.spacing.md} webStyle={{ padding: theme.spacing.md }}>
      <Text variant="heading">Dimensions</Text>
      <Input 
        value={width} 
        onChangeText={setWidth} 
        placeholder="Width" 
        // @ts-ignore - input currently lacks keyboardType in UI
        keyboardType="numeric" 
      />
      <Input 
        value={height} 
        onChangeText={setHeight} 
        placeholder="Height" 
        // @ts-ignore - input currently lacks keyboardType in UI
        keyboardType="numeric" 
      />
      {error && <Text color={theme.colors.error} variant="caption">{error.message}</Text>}
    </Stack>
  );

  const viewport = (
    <Box webStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* @ts-ignore */}
      <Card padding="md" webStyle={{ maxWidth: '80%', maxHeight: '80%', aspectRatio: activeImage ? `${activeImage.width}/${activeImage.height}` : '1' }}>
        <Text>Image Preview</Text>
      </Card>
    </Box>
  );

  return <EditorLayout toolbar={toolbar} leftPanel={leftPanel} viewport={viewport} />;
}
