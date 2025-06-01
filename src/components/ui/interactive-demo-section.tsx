
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollAnimation } from "./animation-presets";
import { FloatingElement } from "./micro-interactions";
import { GradientText } from "./gradient-text";
import { PremiumButton } from "./premium-button";
import { ParticleSystem } from "./particle-system";

export function InteractiveDemoSection() {
  return (
    <ScrollAnimation animation="zoom-in" className="text-center">
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle>
            <GradientText variant="holographic" animation="shimmer" size="xl" weight="bold">
              Interactive Experience
            </GradientText>
          </CardTitle>
          <CardDescription>
            Hover over elements to see dynamic interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['gradient', 'glow', 'neon', 'holographic'].map((variant, i) => (
              <FloatingElement key={variant} variant="bubble" speed="slow" distance="small">
                <PremiumButton 
                  variant={variant as any}
                  animation="float"
                  className="w-full"
                >
                  {variant}
                </PremiumButton>
              </FloatingElement>
            ))}
          </div>
          
          <div className="relative h-32 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg overflow-hidden">
            <ParticleSystem variant="fireflies" density="normal" speed="fast" interactive />
            <div className="absolute inset-0 flex items-center justify-center">
              <GradientText variant="cosmic" animation="glow" size="lg" weight="bold">
                Move your mouse here
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollAnimation>
  );
}
