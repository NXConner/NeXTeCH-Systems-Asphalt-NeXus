
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

export const FleetAnalyticsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Fuel Efficiency Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Fuel consumption chart</div>
              <div className="text-xs">7-day rolling average</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Monthly maintenance spend</div>
              <div className="text-xs">$4,250 this month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
