import { Box, useTheme, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@imageforge/ui';
import { BatchQueue } from '../../components/BatchQueue';

export interface BatchScreenProps {
  onClose: () => void;
}

export function BatchScreen({ onClose }: BatchScreenProps) {
  const theme = useTheme();

  return (
    <Dialog open={true} onClose={onClose} webStyle={{ width: '800px', maxWidth: '90vw', height: '80vh', maxHeight: '800px' }}>
      <DialogHeader title="Batch Operations" onClose={onClose} />
      <DialogBody webStyle={{ flex: 1, overflowY: 'hidden', padding: 0 }}>
        <Box webStyle={{ height: '100%', padding: theme.spacing.md }}>
          <BatchQueue />
        </Box>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" label="Done" onPress={onClose} />
      </DialogFooter>
    </Dialog>
  );
}
