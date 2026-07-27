import { HomeLayout } from '../../layouts/HomeLayout';
import { ImportDropzone } from '../../components/ImportDropzone';
import { ImageGrid } from '../../components/ImageGrid';
import { Stack, Button, Box, useTheme, Text } from '@imageforge/ui';
import { useActiveImage } from '@imageforge/hooks';

export interface HomeScreenProps {
  navigation: {
    openCompress: () => void;
    openResize: () => void;
    openCrop: () => void;
    openRotate: () => void;
    openBatch: () => void;
    openSettings: () => void;
  };
}

export function HomeScreen({ navigation }: HomeScreenProps): JSX.Element {
  const activeImage = useActiveImage();
  const theme = useTheme();

  const quickActions = (
    <Stack gap={theme.spacing.md}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="heading">Quick Actions</Text>
        <Stack direction="row" gap={theme.spacing.sm}>
          <Button icon="settings" variant="ghost" onPress={navigation.openSettings} />
          {/* using 'image' instead of 'layers' since 'layers' is not in IconName */}
          <Button icon="image" variant="secondary" label="Batch Queue" onPress={navigation.openBatch} />
        </Stack>
      </Stack>
      
      <Box webStyle={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: theme.spacing.sm }}>
        {/* using 'zoom-out' instead of 'minimize' */}
        <Button 
          variant="secondary" 
          icon="zoom-out" 
          label="Compress" 
          onPress={navigation.openCompress} 
          disabled={!activeImage} 
        />
        {/* using 'zoom-in' instead of 'maximize' */}
        <Button 
          variant="secondary" 
          icon="zoom-in" 
          label="Resize" 
          onPress={navigation.openResize} 
          disabled={!activeImage} 
        />
        <Button 
          variant="secondary" 
          icon="crop" 
          label="Crop" 
          onPress={navigation.openCrop} 
          disabled={!activeImage} 
        />
        <Button 
          variant="secondary" 
          icon="rotate-cw" 
          label="Rotate" 
          onPress={navigation.openRotate} 
          disabled={!activeImage} 
        />
      </Box>
    </Stack>
  );

  return (
    <HomeLayout
      importDropzone={<ImportDropzone />}
      imageGrid={<ImageGrid />}
      quickActions={quickActions}
    />
  );
}
