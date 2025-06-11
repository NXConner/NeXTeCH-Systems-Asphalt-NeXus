import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, GitFork, Calendar, Code, Package } from 'lucide-react';
import { Module } from '@/services/moduleManager';

interface ModuleGridProps {
  modules: Module[];
  onModuleClick: (module: Module) => void;
}

export default function ModuleGrid({ modules, onModuleClick }: ModuleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <Card
          key={module.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onModuleClick(module)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{module.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {module.description}
                </p>
              </div>
              <Badge variant="secondary">
                <Package className="h-3 w-3 mr-1" />
                v{module.version}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Code className="h-3 w-3 mr-1" />
                  {module.language}
                </Badge>
                {module.category && (
                  <Badge variant="outline">{module.category}</Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {module.stars}
                  </div>
                  <div className="flex items-center">
                    <GitFork className="h-4 w-4 mr-1" />
                    {module.forks}
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(module.lastUpdated).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {module.author}
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 