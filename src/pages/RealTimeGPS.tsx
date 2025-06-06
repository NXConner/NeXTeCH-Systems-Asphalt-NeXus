import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite } from 'lucide-react';
import { EmployeeTrackingMap } from '@/components/dashboard/EmployeeTrackingMap';
// import { VehicleTrackingMap } from '@/components/dashboard/VehicleTrackingMap'; // Uncomment if you create a separate vehicle map

export default function RealTimeGPS() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Satellite className="h-8 w-8" />
          Real-Time GPS Tracking
        </h1>
        <p className="text-muted-foreground mt-2">
          Live location tracking for employees and vehicles
        </p>
      </div>
      <EmployeeTrackingMap />
      {/* <VehicleTrackingMap /> */}
    </div>
  );
}
