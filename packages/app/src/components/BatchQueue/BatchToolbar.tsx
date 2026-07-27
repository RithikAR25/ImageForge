import { Stack, Button, Text } from '@imageforge/ui';
import { useBatchQueue } from '@imageforge/hooks';

export function BatchToolbar() {
  const { start, pause, cancelAll, jobs } = useBatchQueue();
  const isRunning = jobs.some(j => j.status === 'processing');
  const hasJobs = jobs.length > 0;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Text variant="heading">Batch Queue</Text>
      <Stack direction="row" gap={8}>
        {isRunning ? (
          <Button label="Pause" icon="minus" variant="secondary" onPress={pause} />
        ) : (
          <Button label="Start" icon="plus" onPress={start} disabled={!hasJobs} />
        )}
        <Button label="Clear All" icon="trash" variant="ghost" onPress={cancelAll} disabled={!hasJobs} />
      </Stack>
    </Stack>
  );
}
