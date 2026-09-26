'use client';

import React from 'react';
import { OSProvider } from '@/state/os-store';
import { DesktopShell } from '@/core/shell';

export const AeroDesktop: React.FC = () => {
  return (
    <OSProvider>
      <DesktopShell />
    </OSProvider>
  );
};
