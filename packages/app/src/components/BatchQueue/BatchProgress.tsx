import { Box, Stack, Text, ProgressBar, useTheme } from '@imageforge/ui';
import { useBatchQueue } from '@imageforge/hooks';

export function BatchProgress() {
  const { progress } = useBatchQueue();
  const theme = useTheme();

  if (progress.total === 0) return null;

  return (
    <Box webStyle={{ padding: theme.spacing.md }}>
      <Stack gap={8}>
        <Stack direction="row" justifyContent="space-between">
          <Text variant="caption">Overall Progress</Text>
          <Text variant="caption">{progress.completed} / {progress.total}</Text>
        </Stack>
        <ProgressBar progress={progress.percent} />
      </Stack>
    </Box>
  );
}
