import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Download, Star, GitFork, Eye } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Loader2 } from 'lucide-react';
import ModuleSearch, { ModuleFilters } from './ModuleSearch';
import ModuleGrid from './ModuleGrid';
import ModuleDetails from './ModuleDetails';
import ModuleInstallation from './ModuleInstallation';
import { Module } from '@/services/moduleManager';
import { logger } from '@/services/logger';

// Sample marketplace modules
const MARKETPLACE_MODULES: Module[] = [
  {
    id: 'auth-module',
    name: 'Authentication Module',
    version: '1.0.0',
    description: 'A comprehensive authentication module with support for multiple providers',
    author: 'NeXTeCH Systems',
    repository: 'https://github.com/nexttech/auth-module',
    dependencies: [
      { name: '@supabase/supabase-js', version: '^2.0.0' },
      { name: 'react-auth-kit', version: '^3.0.0' }
    ],
    compatibility: ['v1.0.0+'],
    size: '2.5MB',
    lastUpdated: '2024-03-15',
    stars: 150,
    forks: 45,
    language: 'TypeScript',
    category: 'auth',
    license: 'MIT',
    features: [
      'Multi-provider authentication',
      'Role-based access control',
      'Session management',
      'Password reset flow'
    ],
    requirements: [
      'Node.js 16+',
      'React 18+',
      'TypeScript 4.5+'
    ]
  },
  {
    id: 'data-grid',
    name: 'Advanced Data Grid',
    version: '2.1.0',
    description: 'A powerful data grid component with sorting, filtering, and pagination',
    author: 'NeXTeCH Systems',
    repository: 'https://github.com/nexttech/data-grid',
    dependencies: [
      { name: '@tanstack/react-table', version: '^8.0.0' },
      { name: 'react-virtualized', version: '^9.0.0' }
    ],
    compatibility: ['v1.0.0+'],
    size: '1.8MB',
    lastUpdated: '2024-03-10',
    stars: 320,
    forks: 78,
    language: 'TypeScript',
    category: 'ui',
    license: 'MIT',
    features: [
      'Virtual scrolling',
      'Column resizing',
      'Row selection',
      'Custom cell rendering'
    ],
    requirements: [
      'Node.js 16+',
      'React 18+',
      'TypeScript 4.5+'
    ]
  },
  {
    id: 'api-client',
    name: 'API Client',
    version: '1.5.0',
    description: 'A flexible API client with automatic retry and caching',
    author: 'NeXTeCH Systems',
    repository: 'https://github.com/nexttech/api-client',
    dependencies: [
      { name: 'axios', version: '^1.0.0' },
      { name: 'swr', version: '^2.0.0' }
    ],
    compatibility: ['v1.0.0+'],
    size: '1.2MB',
    lastUpdated: '2024-03-05',
    stars: 210,
    forks: 35,
    language: 'TypeScript',
    category: 'api',
    license: 'MIT',
    features: [
      'Request caching',
      'Automatic retry',
      'Request interceptors',
      'Type-safe responses'
    ],
    requirements: [
      'Node.js 16+',
      'TypeScript 4.5+'
    ]
  }
];

export default function Marketplace() {
  const [modules, setModules] = useState<Module[]>(MARKETPLACE_MODULES);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showInstallation, setShowInstallation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = (query: string) => {
    const filtered = MARKETPLACE_MODULES.filter(module =>
      module.name.toLowerCase().includes(query.toLowerCase()) ||
      module.description.toLowerCase().includes(query.toLowerCase())
    );
    setModules(filtered);
  };

  const handleSort = (sortBy: string) => {
    const sorted = [...modules].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stars - a.stars;
        case 'forks':
          return b.forks - a.forks;
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    setModules(sorted);
  };

  const handleFilter = (filters: ModuleFilters) => {
    let filtered = MARKETPLACE_MODULES;

    if (filters.category) {
      filtered = filtered.filter(module => module.category === filters.category);
    }

    if (filters.language) {
      filtered = filtered.filter(module => module.language === filters.language);
    }

    if (filters.compatibility) {
      filtered = filtered.filter(module =>
        module.compatibility.some(version => version.startsWith(filters.compatibility))
      );
    }

    if (filters.minStars > 0) {
      filtered = filtered.filter(module => module.stars >= filters.minStars);
    }

    setModules(filtered);
  };

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  const handleInstall = async () => {
    if (!selectedModule) return;

    setShowInstallation(true);
    setSelectedModule(null);

    try {
      setLoading(true);
      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 2000));
      logger.info('Module installed successfully', { moduleId: selectedModule.id });
    } catch (error) {
      logger.error('Module installation failed', { moduleId: selectedModule.id, error });
    } finally {
      setLoading(false);
      setShowInstallation(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    let filtered = MARKETPLACE_MODULES;

    switch (value) {
      case 'installed':
        // TODO: Filter installed modules
        break;
      case 'updates':
        // TODO: Filter modules with updates
        break;
      case 'featured':
        filtered = filtered.filter(module => module.stars > 100);
        break;
      default:
        break;
    }

    setModules(filtered);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Module Marketplace</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All Modules</TabsTrigger>
              <TabsTrigger value="installed">Installed</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <ModuleSearch
                onSearch={handleSearch}
                onSort={handleSort}
                onFilter={handleFilter}
              />
              <div className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ModuleGrid
                    modules={modules}
                    onModuleClick={handleModuleClick}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-4xl">
          {selectedModule && (
            <ModuleDetails
              module={selectedModule}
              onInstall={handleInstall}
              onClose={() => setSelectedModule(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showInstallation} onOpenChange={setShowInstallation}>
        <DialogContent>
          {selectedModule && (
            <ModuleInstallation
              moduleId={selectedModule.id}
              onComplete={() => setShowInstallation(false)}
              onCancel={() => setShowInstallation(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 