import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useModuleContext } from '@/contexts/ModuleContext';
import { logger } from '@/services/logger';

export default function ModuleSettings() {
  const { installedModules } = useModuleContext();
  const [autoUpdate, setAutoUpdate] = React.useState(true);
  const [updateInterval, setUpdateInterval] = React.useState('daily');
  const [modulePath, setModulePath] = React.useState('./modules');
  const [backupEnabled, setBackupEnabled] = React.useState(true);
  const [backupInterval, setBackupInterval] = React.useState('weekly');

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement save settings
      logger.info('Settings saved successfully');
    } catch (error) {
      logger.error('Failed to save settings', { error });
    }
  };

  const handleResetSettings = () => {
    setAutoUpdate(true);
    setUpdateInterval('daily');
    setModulePath('./modules');
    setBackupEnabled(true);
    setBackupInterval('weekly');
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Module Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="module-path">Module Installation Path</Label>
                  <Input
                    id="module-path"
                    value={modulePath}
                    onChange={(e) => setModulePath(e.target.value)}
                    className="w-[300px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="installed-modules">Installed Modules</Label>
                  <div className="text-sm text-muted-foreground">
                    {installedModules.length} modules installed
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="updates" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-update">Automatic Updates</Label>
                  <Switch
                    id="auto-update"
                    checked={autoUpdate}
                    onCheckedChange={setAutoUpdate}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="update-interval">Update Check Interval</Label>
                  <Select
                    value={updateInterval}
                    onValueChange={setUpdateInterval}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="backup-enabled">Enable Backups</Label>
                  <Switch
                    id="backup-enabled"
                    checked={backupEnabled}
                    onCheckedChange={setBackupEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="backup-interval">Backup Interval</Label>
                  <Select
                    value={backupInterval}
                    onValueChange={setBackupInterval}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <Switch id="debug-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleResetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 