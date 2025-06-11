import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Download, 
  Star, 
  GitFork, 
  Calendar, 
  Code, 
  Package, 
  User, 
  Globe, 
  AlertTriangle 
} from 'lucide-react';
import { Module } from '@/services/moduleManager';

interface ModuleDetailsProps {
  module: Module;
  onInstall: () => void;
  onClose: () => void;
}

export default function ModuleDetails({ module, onInstall, onClose }: ModuleDetailsProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{module.name}</CardTitle>
            <p className="text-muted-foreground mt-1">{module.description}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Code className="h-3 w-3 mr-1" />
              {module.language}
            </Badge>
            <Badge variant="secondary">
              <Package className="h-3 w-3 mr-1" />
              v{module.version}
            </Badge>
            <Badge variant="secondary">
              <User className="h-3 w-3 mr-1" />
              {module.author}
            </Badge>
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(module.lastUpdated).toLocaleDateString()}
            </Badge>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2" />
                    <span>{module.stars} stars</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GitFork className="h-4 w-4 mr-2" />
                    <span>{module.forks} forks</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={module.repository} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Repository
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 mr-2" />
                    <span>Size: {module.size}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>License: {module.license}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Features</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {module.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="dependencies">
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {module.dependencies?.length ? (
                    module.dependencies.map((dep, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{dep.name}</span>
                        <Badge variant="secondary">{dep.version}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No dependencies required</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="compatibility">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Compatible Versions</h4>
                  <div className="flex flex-wrap gap-2">
                    {module.compatibility?.map((version, index) => (
                      <Badge key={index} variant="secondary">
                        {version}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">System Requirements</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {module.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={onInstall}>
              <Download className="h-4 w-4 mr-2" />
              Install Module
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 