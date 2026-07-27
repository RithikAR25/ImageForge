import { Box, Stack, useTheme } from '@imageforge/ui';

export interface HomeLayoutProps {
  importDropzone: any;
  imageGrid: any;
  quickActions?: any;
}

export function HomeLayout({ importDropzone, imageGrid, quickActions }: HomeLayoutProps) {
  const theme = useTheme();

  return (
    <Box webStyle={{ height: '100%', overflowY: 'auto', backgroundColor: theme.colors.background }}>
      <Stack gap={theme.spacing.lg} webStyle={{ maxWidth: 1200, margin: '0 auto', padding: theme.spacing.xl }}>
        <Box>{importDropzone}</Box>
        {quickActions && <Box>{quickActions}</Box>}
        <Box webStyle={{ flex: 1 }}>{imageGrid}</Box>
      </Stack>
    </Box>
  );
}
