import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useModuleContext } from '@/contexts/ModuleContext';
import { Module } from '@/types/module';
import { logger } from '@/services/logger';
import {
  Download,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Package
} from 'lucide-react';

export default function ModuleUpdates() {
  const { installedModules, updateModule } = useModuleContext();
  const [updates, setUpdates] = React.useState<Module[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement fetch updates
      const mockUpdates = installedModules.map(module => ({
        ...module,
        version: `${module.version.split('.')[0]}.${parseInt(module.version.split('.')[1]) + 1}.0`
      }));
      setUpdates(mockUpdates);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch updates');
      logger.error('Failed to fetch updates', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    try {
      setLoading(true);
      setError(null);
      for (const update of updates) {
        await updateModule(update.id, update);
      }
      setUpdates([]);
      logger.info('All modules updated successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update modules');
      logger.error('Failed to update modules', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModule = async (module: Module) => {
    try {
      setLoading(true);
      setError(null);
      await updateModule(module.id, module);
      setUpdates(updates.filter(u => u.id !== module.id));
      logger.info('Module updated successfully', { moduleId: module.id });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update module');
      logger.error('Failed to update module', { error, moduleId: module.id });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUpdates();
  }, [installedModules]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Module Updates</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={fetchUpdates}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check for Updates
              </Button>
              {updates.length > 0 && (
                <Button
                  onClick={handleUpdateAll}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Update All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-4 w-4 mr-2 inline" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : updates.length > 0 ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {updates.map((update) => {
                  const currentModule = installedModules.find(m => m.id === update.id);
                  return (
                    <Card key={update.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold">{update.name}</h3>
                              <Badge variant="secondary">
                                <Package className="h-3 w-3 mr-1" />
                                v{update.version}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {update.description}
                            </p>
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Current version: </span>
                              <span className="font-medium">{currentModule?.version}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleUpdateModule(update)}
                            disabled={loading}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">All modules are up to date</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your installed modules are running the latest versions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 