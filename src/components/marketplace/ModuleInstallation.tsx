import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { moduleManager } from '@/services/moduleManager';
import { logger } from '@/services/logger';

interface ModuleInstallationProps {
  moduleId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function ModuleInstallation({ moduleId, onComplete, onCancel }: ModuleInstallationProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'installing' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleInstall = async () => {
    setStatus('installing');
    setError(null);
    setProgress(0);

    try {
      // Simulate installation progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Install module
      await moduleManager.installModule(moduleId, {
        id: moduleId,
        name: 'Test Module',
        version: '1.0.0',
        description: 'Test module description',
        author: 'Test Author',
        repository: 'https://github.com/test/module',
        dependencies: [],
        compatibility: ['v1.0.0+'],
        size: '1MB',
        lastUpdated: new Date().toISOString()
      });

      clearInterval(interval);
      setProgress(100);
      setStatus('completed');
      logger.info('Module installation completed', { moduleId });

      // Wait a bit before calling onComplete
      setTimeout(onComplete, 1000);
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Installation failed');
      logger.error('Module installation failed', { moduleId, error });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Installing Module</span>
          {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === 'completed' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Module installed successfully. The application will restart to apply changes.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            {status === 'idle' && (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleInstall}>
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
              </>
            )}

            {status === 'installing' && (
              <Button disabled>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Installing...
              </Button>
            )}

            {status === 'completed' && (
              <Button onClick={onComplete}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Done
              </Button>
            )}

            {status === 'error' && (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Close
                </Button>
                <Button onClick={handleInstall}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 