import { Stack, Box, Text, useTheme } from '@imageforge/ui';
import { useBatchQueue } from '@imageforge/hooks';
import { BatchItem } from './BatchItem';
import { BatchToolbar } from './BatchToolbar';
import { BatchProgress } from './BatchProgress';

export function BatchQueue() {
  const { jobs } = useBatchQueue();
  const theme = useTheme();

  return (
    <Stack gap={theme.spacing.md} webStyle={{ height: '100%' }}>
      <BatchToolbar />
      <BatchProgress />
      
      <Box webStyle={{ flex: 1, overflowY: 'auto' }}>
        {jobs.length === 0 ? (
          <Text color={theme.colors.secondary}>Queue is empty.</Text>
        ) : (
          <Stack gap={theme.spacing.sm}>
            {jobs.map(job => (
              <BatchItem key={job.id} job={job} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
