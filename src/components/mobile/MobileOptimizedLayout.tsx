
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Calendar, AlertTriangle, MapPin, Users, FileText, Home } from 'lucide-react';
import { useCrossComponentLinks } from '@/hooks/useCrossComponentLinks';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
}

export const MobileOptimizedLayout = ({ children }: MobileOptimizedLayoutProps) => {
  const isMobile = useIsMobile();
  const { linkToVehicle, linkToJob } = useCrossComponentLinks();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobile) {
    return <>{children}</>;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background border-b p-4">
        <h1 className="text-xl font-bold">Fleet Nexus</h1>
      </div>

      {/* Mobile Content */}
      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3" onClick={() => linkToVehicle('all')}>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-lg font-bold">24</div>
                <div className="text-xs text-muted-foreground">Vehicles</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3" onClick={() => linkToJob('all')}>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-lg font-bold">8</div>
                <div className="text-xs text-muted-foreground">Active Jobs</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Alert Banner */}
        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium">2 vehicles need maintenance</span>
            </div>
          </CardContent>
        </Card>

        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="grid grid-cols-5 p-2">
          <Button 
            variant={isActive("/dashboard") ? "default" : "ghost"} 
            size="sm" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant={isActive("/fleet") ? "default" : "ghost"} 
            size="sm" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => navigate("/fleet")}
          >
            <Truck className="h-4 w-4" />
            <span className="text-xs">Fleet</span>
          </Button>
          <Button 
            variant={isActive("/jobs") ? "default" : "ghost"}
            size="sm" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => navigate("/jobs")}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Jobs</span>
          </Button>
          <Button 
            variant={isActive("/employee-management") ? "default" : "ghost"}
            size="sm" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => navigate("/employee-management")}
          >
            <Users className="h-4 w-4" />
            <span className="text-xs">Staff</span>
          </Button>
          <Button 
            variant={isActive("/accounting") ? "default" : "ghost"}
            size="sm" 
            className="flex flex-col gap-1 h-auto py-2"
            onClick={() => navigate("/accounting")}
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs">Finance</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
