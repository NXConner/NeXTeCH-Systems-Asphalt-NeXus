import React from 'react';
import { EnhancedModule, ModuleGrid } from '../ui/enhanced-module';
import { Package } from 'lucide-react';
import { Module } from '@/services/moduleManager';

interface ModuleGridProps {
  modules: Module[];
  onModuleClick: (module: Module) => void;
}

export const ModuleGridView: React.FC<ModuleGridProps> = ({ modules, onModuleClick }) => {
  return (
    <ModuleGrid>
      {modules.map((mod) => (
        <EnhancedModule
          key={mod.id}
          title={mod.name}
          description={mod.description}
          icon={<Package className="h-6 w-6 text-primary" />}
          status={mod.status}
          hover
          actions={
            <button
              className="text-primary underline text-sm"
              onClick={() => onModuleClick(mod)}
            >
              View
            </button>
          }
        >
          <div className="text-sm text-muted-foreground mb-2">{mod.shortDescription}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {mod.tags?.map((tag: string) => (
              <span key={tag} className="bg-muted px-2 py-1 rounded text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </EnhancedModule>
      ))}
    </ModuleGrid>
  );
};

export default ModuleGridView; 