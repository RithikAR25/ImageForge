import { Box, Stack, Icon, Text, useTheme } from '@imageforge/ui';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  const theme = useTheme();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Box webStyle={{
        padding: theme.spacing.sm,
        borderRadius: theme.radii.md,
        backgroundColor: isActive ? theme.colors.surface : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        cursor: 'pointer'
      }}>
        <Icon name={icon} size={20} color={isActive ? theme.colors.primary : theme.colors.secondary} />
        <Text color={isActive ? theme.colors.text : theme.colors.secondary} weight={isActive ? 'medium' : 'regular'}>
          {label}
        </Text>
      </Box>
    </Link>
  );
}

export function Sidebar() {
  const theme = useTheme();
  return (
    <Box webStyle={{ 
      width: 240, 
      borderRight: `1px solid ${theme.colors.border}`, 
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md
    }}>
      <Stack direction="row" alignItems="center" gap={theme.spacing.sm} webStyle={{ marginBottom: theme.spacing.md }}>
        <Icon name="image" size={24} color={theme.colors.primary} />
        <Text variant="heading" weight="bold">ImageForge</Text>
      </Stack>

      <Stack gap={theme.spacing.xs}>
        <NavItem to="/" icon="home" label="Gallery" />
        <NavItem to="/compress" icon="minimize-2" label="Compress" />
        <NavItem to="/resize" icon="maximize" label="Resize" />
        <NavItem to="/crop" icon="crop" label="Crop" />
        <NavItem to="/rotate" icon="rotate-cw" label="Rotate" />
      </Stack>

      <Box webStyle={{ flex: 1 }} />
      
      <Stack gap={theme.spacing.xs}>
        <NavItem to="/batch" icon="layers" label="Batch Processing" />
        <NavItem to="/settings" icon="settings" label="Settings" />
      </Stack>
    </Box>
  );
}
