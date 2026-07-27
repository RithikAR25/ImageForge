import React, { useState } from 'react';
import { EditorLayout } from '../../layouts/EditorLayout';
import { EditorToolbar } from '../../components/EditorToolbar';
import { Box, Stack, Text, Card, useTheme, Button } from '@imageforge/ui';
import { useActiveImage, useImageProcessor } from '@imageforge/hooks';
import type { ProcessingOperation, CropConfig, ImageFile, ProcessingResult } from '@imageforge/types';
import { imageStore, historyStore } from '@imageforge/shared';

export interface CropScreenProps {
  onBack: () => void;
}

export function CropScreen({ onBack }: CropScreenProps): JSX.Element {
  const activeImage = useActiveImage();
  const { process, isProcessing, error } = useImageProcessor();
  const theme = useTheme();

  const [aspect, setAspect] = useState<'free' | '1:1' | '16:9'>('free');

  const handleApply = () => {
    if (!activeImage) return;

    const op: ProcessingOperation = {
      type: 'crop',
      config: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        shape: 'rectangle',
        unit: 'px',
      } as CropConfig,
    };

    const beforeSnapshot = { ...activeImage };
    
    process(activeImage, [op]).then((result: ProcessingResult) => {
      const newImage: ImageFile = {
        ...activeImage,
        fileSize: result.outputSize,
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
      console.error('Crop failed', err);
    });
  };

  const toolbar = <EditorToolbar title="Crop" onApply={handleApply} onCancel={onBack} isApplying={isProcessing} />;

  const leftPanel = (
    <Stack gap={theme.spacing.md} webStyle={{ padding: theme.spacing.md }}>
      <Text variant="heading">Aspect Ratio</Text>
      <Stack gap={theme.spacing.sm}>
        <Button variant={aspect === 'free' ? 'primary' : 'secondary'} label="Freeform" onPress={() => { setAspect('free'); }} />
        <Button variant={aspect === '1:1' ? 'primary' : 'secondary'} label="Square (1:1)" onPress={() => { setAspect('1:1'); }} />
        <Button variant={aspect === '16:9' ? 'primary' : 'secondary'} label="Widescreen (16:9)" onPress={() => { setAspect('16:9'); }} />
      </Stack>
      {error && <Text color={theme.colors.error} variant="caption">{error.message}</Text>}
    </Stack>
  );

  const viewport = (
    <Box webStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* @ts-ignore */}
      <Card padding="md" webStyle={{ maxWidth: '80%', maxHeight: '80%', aspectRatio: aspect === '1:1' ? '1' : aspect === '16:9' ? '16/9' : 'auto' }}>
        <Text>Crop Area Preview</Text>
      </Card>
    </Box>
  );

  return <EditorLayout toolbar={toolbar} leftPanel={leftPanel} viewport={viewport} />;
}
