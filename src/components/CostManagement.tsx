
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CostManagementCenter } from './costs/CostManagementCenter';
import { CostCalculator } from './costs/CostCalculator';
import { DollarSign, Calculator, TrendingUp, Package } from 'lucide-react';

const CostManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Cost Management System
        </h1>
        <p className="text-muted-foreground mt-2">
          Auto-updating material, supply, fuel prices with Virginia-specific tax calculations
        </p>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Live Pricing
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Cost Calculator
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Price Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <CostManagementCenter />
        </TabsContent>

        <TabsContent value="calculator">
          <CostCalculator />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Price Analytics Coming Soon</h3>
            <p className="text-muted-foreground">
              Historical price trends, market analysis, and cost forecasting will be available here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostManagement;
