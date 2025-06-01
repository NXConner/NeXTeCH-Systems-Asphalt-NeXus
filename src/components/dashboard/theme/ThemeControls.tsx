
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, Eye } from "lucide-react";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { PremiumButton } from "@/components/ui/premium-button";
import { AdvancedCard } from "@/components/ui/advanced-card";
import { cn } from "@/lib/utils";

interface ThemeControlsProps {
  activeDemo: string;
  onDemoChange: (demo: string) => void;
}

export function ThemeControls({ activeDemo, onDemoChange }: ThemeControlsProps) {
  return (
    <AdvancedCard variant="holographic" hover glow pattern="circuit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Controls
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
        <CardDescription>
          Switch themes instantly and see the effects in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <PremiumButton variant="holographic" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </PremiumButton>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            {['glass', 'neon', 'crystalline', 'plasma'].map((variant) => (
              <Button
                key={variant}
                variant="outline"
                size="sm"
                className={cn(
                  "h-12 capitalize transition-all duration-300",
                  activeDemo === variant && "ring-2 ring-primary"
                )}
                onClick={() => onDemoChange(variant)}
              >
                {variant}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </AdvancedCard>
  );
}
