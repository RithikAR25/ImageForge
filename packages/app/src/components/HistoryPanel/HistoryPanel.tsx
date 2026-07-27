import { Box, Stack, Text, Button, Card, useTheme } from '@imageforge/ui';
import { useHistory } from '@imageforge/hooks';

export interface HistoryPanelProps {
  imageId: string;
}

export function HistoryPanel({ imageId }: HistoryPanelProps) {
  const { canUndo, canRedo, undo, redo, entries } = useHistory(imageId);
  const theme = useTheme();

  return (
    <Stack gap={theme.spacing.md} webStyle={{ height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="heading">History</Text>
        <Stack direction="row" gap={theme.spacing.xs}>
          <Button 
            icon="undo" 
            variant="secondary" 
            onPress={undo} 
            disabled={!canUndo}
            label="Undo"
          />
          <Button 
            icon="redo" 
            variant="secondary" 
            onPress={redo} 
            disabled={!canRedo}
            label="Redo"
          />
        </Stack>
      </Stack>

      <Box webStyle={{ flex: 1, overflowY: 'auto' }}>
        {entries.length === 0 ? (
          <Text color={theme.colors.secondary}>No history for this image.</Text>
        ) : (
          <Stack gap={theme.spacing.sm}>
            {entries.map((entry) => (
              <Card key={entry.id} padding="sm">
                <Text weight="medium">
                  {entry.operation.type.charAt(0).toUpperCase() + entry.operation.type.slice(1)}
                </Text>
                <Text variant="caption" color={theme.colors.secondary}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </Text>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
