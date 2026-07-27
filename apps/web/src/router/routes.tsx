import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';

import { HomeScreen, CompressScreen, ResizeScreen, CropScreen, RotateScreen, SettingsScreen, BatchScreen } from '@imageforge/app';

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <HomeScreen 
      navigation={{
        openCompress: () => navigate('/compress'),
        openResize: () => navigate('/resize'),
        openCrop: () => navigate('/crop'),
        openRotate: () => navigate('/rotate'),
        openBatch: () => navigate('/batch'),
        openSettings: () => navigate('/settings'),
      }}
    />
  );
}

function EditorRoute({ Component }: { Component: React.ComponentType<{ onBack: () => void }> }) {
  const navigate = useNavigate();
  return <Component onBack={() => navigate(-1)} />;
}

function ModalRoute({ Component }: { Component: React.ComponentType<{ onClose: () => void }> }) {
  const navigate = useNavigate();
  return <Component onClose={() => navigate(-1)} />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomeRoute />} />
        <Route path="compress" element={<EditorRoute Component={CompressScreen} />} />
        <Route path="resize" element={<EditorRoute Component={ResizeScreen} />} />
        <Route path="crop" element={<EditorRoute Component={CropScreen} />} />
        <Route path="rotate" element={<EditorRoute Component={RotateScreen} />} />
        <Route path="settings" element={<ModalRoute Component={SettingsScreen} />} />
        <Route path="batch" element={<ModalRoute Component={BatchScreen} />} />
      </Route>
    </Routes>
  );
}
