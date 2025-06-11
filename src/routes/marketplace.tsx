import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ModuleProvider } from '@/contexts/ModuleContext';
import Marketplace from '@/components/marketplace/Marketplace';
import ModuleDetails from '@/components/marketplace/ModuleDetails';
import ModuleInstallation from '@/components/marketplace/ModuleInstallation';

export default function MarketplaceRoutes() {
  return (
    <ModuleProvider>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/:moduleId" element={<ModuleDetails />} />
        <Route path="/:moduleId/install" element={<ModuleInstallation />} />
      </Routes>
    </ModuleProvider>
  );
} 