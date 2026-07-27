import React from 'react';
import { Box, Stack, Text, Card, useTheme, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@imageforge/ui';
import { useSettings } from '@imageforge/hooks';

export interface SettingsScreenProps {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: SettingsScreenProps): JSX.Element {
  const { settings, updateSettings } = useSettings();
  const theme = useTheme();

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogHeader title="Settings" onClose={onClose} />
      <DialogBody>
        <Stack gap={theme.spacing.lg}>
          <Box>
            <Text variant="heading" webStyle={{ marginBottom: theme.spacing.sm }}>General</Text>
            <Card padding="md">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Text>Theme</Text>
                <Stack direction="row" gap={theme.spacing.xs}>
                  <Button 
                    variant={settings.theme === 'light' ? 'primary' : 'secondary'} 
                    label="Light" 
                    onPress={() => { updateSettings({ theme: 'light' }); }} 
                  />
                  <Button 
                    variant={settings.theme === 'dark' ? 'primary' : 'secondary'} 
                    label="Dark" 
                    onPress={() => { updateSettings({ theme: 'dark' }); }} 
                  />
                  <Button 
                    variant={settings.theme === 'system' ? 'primary' : 'secondary'} 
                    label="System" 
                    onPress={() => { updateSettings({ theme: 'system' }); }} 
                  />
                </Stack>
              </Stack>
            </Card>
          </Box>
          <Box>
            <Text variant="heading" webStyle={{ marginBottom: theme.spacing.sm }}>Batch Processing</Text>
            <Card padding="md">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Text>Max Concurrent Workers</Text>
                <Stack direction="row" gap={theme.spacing.xs} alignItems="center">
                  <Button 
                    variant="ghost" 
                    icon="minus" 
                    onPress={() => { updateSettings({ maxConcurrentJobs: Math.max(1, settings.maxConcurrentJobs - 1) }); }} 
                  />
                  <Text>{String(settings.maxConcurrentJobs)}</Text>
                  <Button 
                    variant="ghost" 
                    icon="plus" 
                    onPress={() => { updateSettings({ maxConcurrentJobs: Math.min(8, settings.maxConcurrentJobs + 1) }); }} 
                  />
                </Stack>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" label="Done" onPress={onClose} />
      </DialogFooter>
    </Dialog>
  );
}
