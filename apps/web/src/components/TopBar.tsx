import { Box, Stack, Text, useTheme } from '@imageforge/ui';
import { useActiveImage } from '@imageforge/hooks';

export function TopBar() {
  const theme = useTheme();
  const activeImage = useActiveImage();

  return (
    <Box webStyle={{
      height: 56,
      borderBottom: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.background,
      padding: `0 ${theme.spacing.md}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Stack direction="row" alignItems="center" gap={theme.spacing.sm}>
        {activeImage && (
          <>
            <Text color={theme.colors.secondary}>Active Image:</Text>
            <Text weight="medium">{activeImage.name}</Text>
          </>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" gap={theme.spacing.sm}>
        {/* Additional top bar actions like Export can go here */}
      </Stack>
    </Box>
  );
}
