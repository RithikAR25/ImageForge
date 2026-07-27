import React, { useState } from 'react';
import { EditorLayout } from '../../layouts/EditorLayout';
import { EditorToolbar } from '../../components/EditorToolbar';
import { Box, Stack, Text, Card, useTheme, Button } from '@imageforge/ui';
import { useActiveImage, useImageProcessor } from '@imageforge/hooks';
import type { ProcessingOperation, CompressConfig, ImageFile, ProcessingResult } from '@imageforge/types';
import { imageStore, historyStore } from '@imageforge/shared';

export interface CompressScreenProps {
  onBack: () => void;
}

export function CompressScreen({ onBack }: CompressScreenProps): JSX.Element {
  const activeImage = useActiveImage();
  const { process, isProcessing, error } = useImageProcessor();
  const theme = useTheme();

  const [quality, setQuality] = useState(80);

  const handleApply = () => {
    if (!activeImage) return;

    const op: ProcessingOperation = {
      type: 'compress',
      config: {
        quality,
        codec: 'jpeg',
      } as CompressConfig,
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
      console.error('Compression failed', err);
    });
  };

  const toolbar = (
    <EditorToolbar 
      title="Compress" 
      onApply={handleApply} 
      onCancel={onBack} 
      isApplying={isProcessing} 
    />
  );

  const leftPanel = (
    <Stack gap={theme.spacing.md} webStyle={{ padding: theme.spacing.md }}>
      <Text variant="heading">Settings</Text>
      <Box>
        <Text variant="caption">Quality: {quality}</Text>
        <Stack direction="row" gap={theme.spacing.sm} webStyle={{ marginTop: theme.spacing.sm }}>
          <Button variant="secondary" label="60" onPress={() => { setQuality(60); }} />
          <Button variant="secondary" label="80" onPress={() => { setQuality(80); }} />
          <Button variant="secondary" label="95" onPress={() => { setQuality(95); }} />
        </Stack>
      </Box>
      {error && (
        <Text color={theme.colors.error} variant="caption">
          {error.message}
        </Text>
      )}
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

  return (
    <EditorLayout
      toolbar={toolbar}
      leftPanel={leftPanel}
      viewport={viewport}
    />
  );
}
