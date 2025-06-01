import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function ARMeasurementCustomerPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AR Measurement (Customer)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600">Point your device and tap to measure your property or project area in AR. (Full AR integration required)</div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" disabled>Start AR Measurement (Coming Soon)</button>
      </CardContent>
    </Card>
  );
} 