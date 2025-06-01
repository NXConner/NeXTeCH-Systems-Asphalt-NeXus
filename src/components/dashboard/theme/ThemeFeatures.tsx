
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap } from "lucide-react";
import { AdvancedCard } from "@/components/ui/advanced-card";
import { cn } from "@/lib/utils";

interface ThemeFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count: string;
  color: string;
}

const themeFeatures: ThemeFeature[] = [
  {
    title: "Premium Themes",
    description: "12+ professionally designed themes",
    icon: Crown,
    count: "12+",
    color: "text-yellow-500"
  },
  {
    title: "Visual Effects",
    description: "Advanced animations and interactions",
    icon: Sparkles,
    count: "20+",
    color: "text-purple-500"
  },
  {
    title: "Performance",
    description: "Optimized for smooth experience",
    icon: Zap,
    count: "60fps",
    color: "text-green-500"
  }
];

export function ThemeFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themeFeatures.map((feature, index) => (
        <AdvancedCard
          key={feature.title}
          variant="glass"
          hover
          glow
          className="text-center"
        >
          <CardContent className="pt-6">
            <div className={cn("inline-flex p-3 rounded-full mb-4", feature.color)}>
              <feature.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold mb-1">{feature.count}</div>
            <div className="font-semibold mb-2">{feature.title}</div>
            <div className="text-sm text-muted-foreground">{feature.description}</div>
          </CardContent>
        </AdvancedCard>
      ))}
    </div>
  );
}
