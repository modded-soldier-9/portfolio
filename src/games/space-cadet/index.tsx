'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SpaceCadetIcon } from '@/core/assets';
import type { AppModuleContract } from '@/apps/types';

const DynamicSpaceCadetGame = dynamic(
  () => import('./SpaceCadetGame').then((mod) => mod.SpaceCadetGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full bg-[#090514] text-white">
        <SpaceCadetIcon size={48} className="animate-pulse mb-3" />
        <div className="text-[14px] font-semibold text-purple-300">Loading 3D Pinball Space Cadet...</div>
      </div>
    ),
  }
);

export const spaceCadetModule: AppModuleContract = {
  id: 'space-cadet',
  getWindowConfig: () => ({
    id: 'space-cadet',
    title: '3D Pinball for Windows - Space Cadet',
    shortLabel: 'Space Cadet',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    defaultPos: { x: 260, y: 30, width: 620, height: 620 },
    pinned: true,
    category: 'game',
    description: 'Classic Windows Space Cadet 3D Pinball with arcade table physics and retro audio',
  }),
  renderIcon: (size = 32) => <SpaceCadetIcon size={size} />,
  Component: (props) => <DynamicSpaceCadetGame {...props} />,
};

export default spaceCadetModule;
