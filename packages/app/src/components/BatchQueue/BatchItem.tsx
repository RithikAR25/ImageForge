import React from 'react';
import { Box, Stack, Text, Card, ProgressBar, Badge, useTheme } from '@imageforge/ui';
import type { BatchJob } from '@imageforge/types';

export interface BatchItemProps {
  job: BatchJob;
}

export function BatchItem({ job }: BatchItemProps) {
  const theme = useTheme();
  
  let variant: 'primary' | 'secondary' | 'success' | 'error' = 'secondary';
  if (job.status === 'processing') variant = 'primary';
  if (job.status === 'complete') variant = 'success';
  if (job.status === 'failed') variant = 'error';

  return (
    <Card padding="sm">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text weight="medium">Image: {job.imageId.slice(0, 8)}...</Text>
        <Badge variant={variant}>{job.status.toUpperCase()}</Badge>
      </Stack>
      {job.status === 'processing' && (
        <Box webStyle={{ marginTop: theme.spacing.sm }}>
          <ProgressBar progress={job.progress} />
        </Box>
      )}
      {job.error && (
        <Text variant="caption" color={theme.colors.error}>
          {job.error.message}
        </Text>
      )}
    </Card>
  );
}
