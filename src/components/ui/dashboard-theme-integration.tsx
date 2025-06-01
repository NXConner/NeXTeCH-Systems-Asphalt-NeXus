
import * as React from "react";
import { Sparkles } from "lucide-react";
import { GradientText } from "./gradient-text";
import { AnimationPresets, ScrollAnimation } from "./animation-presets";
import { ParticleSystem } from "./particle-system";
import { InteractiveBackground } from "./interactive-background";
import { ThemeFeatures } from "../dashboard/theme/ThemeFeatures";
import { ThemeControls } from "../dashboard/theme/ThemeControls";
import { PerformanceCards } from "../dashboard/theme/PerformanceCards";
import { cn } from "@/lib/utils";

interface DashboardThemeIntegrationProps {
  className?: string;
  showBackground?: boolean;
  enableAnimations?: boolean;
}

export function DashboardThemeIntegration({ 
  className,
  showBackground = true,
  enableAnimations = true 
}: DashboardThemeIntegrationProps) {
  const [activeDemo, setActiveDemo] = React.useState("themes");

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showBackground && (
        <>
          <InteractiveBackground variant="neural" density="medium" speed="slow" />
          <ParticleSystem variant="cosmic" density="sparse" speed="slow" connections />
        </>
      )}
      
      <div className="relative z-10 space-y-6">
        <ScrollAnimation animation="fade-in" className="text-center">
          <GradientText 
            variant="holographic" 
            animation="shimmer" 
            size="2xl" 
            weight="bold"
            className="block mb-2"
          >
            Advanced Theme System
          </GradientText>
          <p className="text-muted-foreground">
            Experience premium theming with cutting-edge UI effects
          </p>
        </ScrollAnimation>

        <ScrollAnimation animation="slide-up" className="mt-8">
          <ThemeFeatures />
        </ScrollAnimation>

        <ScrollAnimation animation="zoom-in" className="mt-8">
          <ThemeControls activeDemo={activeDemo} onDemoChange={setActiveDemo} />
        </ScrollAnimation>

        <ScrollAnimation animation="slide-up" className="mt-8">
          <PerformanceCards />
        </ScrollAnimation>
      </div>
    </div>
  );
}
