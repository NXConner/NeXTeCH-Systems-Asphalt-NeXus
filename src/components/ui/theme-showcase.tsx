
import * as React from "react";
import { ParticleSystem } from "./particle-system";
import { GradientText } from "./gradient-text";
import { PremiumButton } from "./premium-button";
import { InteractiveBackground } from "./interactive-background";
import { ScrollAnimation } from "./animation-presets";
import { ThemeEffectsShowcase } from "./theme-effects-showcase";
import { InteractiveShapesSection } from "./interactive-shapes-section";
import { TypographyEffectsShowcase } from "./typography-effects-showcase";
import { InteractiveDemoSection } from "./interactive-demo-section";
import { Sparkles, Palette } from "lucide-react";

export function ThemeShowcase() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <InteractiveBackground variant="neural" density="medium" speed="normal" />
      <ParticleSystem variant="cosmic" density="normal" speed="normal" connections />
      
      <div className="relative z-10 container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <ScrollAnimation animation="fade-in" className="text-center space-y-6">
          <GradientText 
            variant="holographic" 
            animation="shimmer" 
            size="3xl" 
            weight="extrabold"
            className="block"
          >
            Ultimate Theme Experience
          </GradientText>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the most advanced theming system with cutting-edge UI effects, 
            animations, and interactive elements.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <PremiumButton variant="holographic" size="lg" animation="glow">
              <Sparkles className="h-5 w-5" />
              Explore Themes
            </PremiumButton>
            <PremiumButton variant="crystalline" size="lg" animation="shimmer">
              <Palette className="h-5 w-5" />
              Customize
            </PremiumButton>
          </div>
        </ScrollAnimation>

        {/* Interactive Shapes */}
        <InteractiveShapesSection />

        {/* Feature Cards Grid */}
        <ThemeEffectsShowcase />

        {/* Typography Effects */}
        <TypographyEffectsShowcase />

        {/* Interactive Demo */}
        <InteractiveDemoSection />
      </div>
    </div>
  );
}
