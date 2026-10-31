'use client';

import React from 'react';
import { OSProvider } from '@/state/os-store';
import { DesktopShell } from '@/core/shell';
import { WP7MobileShell } from '@/mobile/wp7/WP7MobileShell';
import { useViewport } from '@/hooks/useViewport';

const ResponsiveShellManager: React.FC = () => {
  const { forcedMode, setForcedMode } = useViewport();

  if (forcedMode === 'desktop') {
    return <DesktopShell />;
  }

  if (forcedMode === 'mobile') {
    return (
      <WP7MobileShell
        onSwitchToDesktop={() => setForcedMode('desktop')}
      />
    );
  }

  // Zero-CLS CSS responsive display gating
  return (
    <>
      <DesktopShell className="hidden md:block" />
      <WP7MobileShell
        className="block md:hidden"
        onSwitchToDesktop={() => setForcedMode('desktop')}
      />
    </>
  );
};

export const AeroDesktop: React.FC = () => {
  return (
    <OSProvider>
      <ResponsiveShellManager />
    </OSProvider>
  );
};
