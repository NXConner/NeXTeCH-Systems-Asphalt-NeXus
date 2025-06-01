import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CostManagement from '@/components/CostManagement';
import { MapPin, Navigation, Satellite } from 'lucide-react';

export default function RealTimeGPS() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Satellite className="h-8 w-8" />
          Real-Time GPS Tracking
        </h1>
        <p className="text-muted-foreground mt-2">
          Live location tracking with integrated cost management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              GPS Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Real-time GPS tracking functionality will be integrated here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Navigation Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Route optimization and navigation features will be available here.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <CostManagement />
      </div>
    </div>
  );
}
