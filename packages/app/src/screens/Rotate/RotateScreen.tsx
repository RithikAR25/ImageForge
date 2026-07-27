import { useState } from 'react';
import { EditorLayout } from '../../layouts/EditorLayout';
import { EditorToolbar } from '../../components/EditorToolbar';
import { Box, Stack, Text, Card, useTheme, Button } from '@imageforge/ui';
import { useActiveImage, useImageProcessor } from '@imageforge/hooks';
import type { ProcessingOperation, RotateConfig, ImageFile, ProcessingResult } from '@imageforge/types';
import { imageStore, historyStore } from '@imageforge/shared';

export interface RotateScreenProps {
  onBack: () => void;
}

export function RotateScreen({ onBack }: RotateScreenProps): JSX.Element {
  const activeImage = useActiveImage();
  const { process, isProcessing, error } = useImageProcessor();
  const theme = useTheme();

  const [angle, setAngle] = useState<number>(0);

  const handleApply = () => {
    if (!activeImage) return;

    // Constrain angle to valid RotateConfig angle
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const configAngle = (normalizedAngle === 90 || normalizedAngle === 180 || normalizedAngle === 270) ? normalizedAngle : 90;

    const op: ProcessingOperation = {
      type: 'rotate',
      config: {
        angle: configAngle,
        lossless: true,
        expand: true,
      } as RotateConfig,
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
      console.error('Rotate failed', err);
    });
  };

  const toolbar = <EditorToolbar title="Rotate" onApply={handleApply} onCancel={onBack} isApplying={isProcessing} />;

  const leftPanel = (
    <Stack gap={theme.spacing.md} webStyle={{ padding: theme.spacing.md }}>
      <Text variant="heading">Angle</Text>
      <Text variant="caption">{String(angle)}°</Text>
      <Stack direction="row" gap={theme.spacing.sm}>
        {/* rotate-ccw doesn't exist, using undo */}
        <Button variant="secondary" icon="undo" onPress={() => { setAngle(a => a - 90); }} />
        <Button variant="secondary" icon="rotate-cw" onPress={() => { setAngle(a => a + 90); }} />
      </Stack>
      {error && <Text color={theme.colors.error} variant="caption">{error.message}</Text>}
    </Stack>
  );

  const viewport = (
    <Box webStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* @ts-ignore */}
      <Card 
        padding="md" 
        webStyle={{ 
          maxWidth: '80%', 
          maxHeight: '80%', 
          aspectRatio: activeImage ? `${activeImage.width}/${activeImage.height}` : '1',
          transform: `rotate(${angle}deg)`,
          transition: 'transform 0.3s ease'
        }}
      >
        <Text>Image Preview</Text>
      </Card>
    </Box>
  );

  return <EditorLayout toolbar={toolbar} leftPanel={leftPanel} viewport={viewport} />;
}
