
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Settings } from "lucide-react";
import { AdvancedCard } from "@/components/ui/advanced-card";

export function PerformanceCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdvancedCard variant="gradient" hover animation="shimmer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Enhanced Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Render Speed</span>
              <Badge variant="secondary">60fps</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Bundle Size</span>
              <Badge variant="secondary">Optimized</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">GPU Acceleration</span>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>
        </CardContent>
      </AdvancedCard>

      <AdvancedCard variant="crystalline" hover glow>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Color Schemes</span>
              <Badge variant="secondary">Unlimited</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Animation Controls</span>
              <Badge variant="secondary">Advanced</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Export/Import</span>
              <Badge variant="secondary">JSON</Badge>
            </div>
          </div>
        </CardContent>
      </AdvancedCard>
    </div>
  );
}
