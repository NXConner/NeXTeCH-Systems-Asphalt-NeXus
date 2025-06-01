
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollAnimation } from "./animation-presets";
import { AdvancedCard } from "./advanced-card";
import { Zap, Palette, Rocket } from "lucide-react";

export function ThemeEffectsShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ScrollAnimation animation="slide-left">
        <AdvancedCard 
          variant="holographic" 
          hover 
          glow 
          pattern="circuit" 
          animation="shimmer"
          className="h-full"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Advanced Effects
            </CardTitle>
            <CardDescription>
              Glass morphism, holographic displays, and 3D transforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="secondary" className="animate-pulse">Holographic</Badge>
              <Badge variant="outline" className="animate-glow">Crystalline</Badge>
              <Badge className="animate-shimmer">Glass Morph</Badge>
            </div>
          </CardContent>
        </AdvancedCard>
      </ScrollAnimation>

      <ScrollAnimation animation="zoom-in">
        <AdvancedCard 
          variant="crystalline" 
          hover 
          glow 
          pattern="hexagon" 
          animation="float"
          className="h-full"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              Dynamic Colors
            </CardTitle>
            <CardDescription>
              Adaptive color systems with smart contrast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {['primary', 'secondary', 'accent', 'muted'].map((color, i) => (
                <div
                  key={color}
                  className={`h-8 rounded-lg bg-${color} animate-pulse border border-border/30 transition-all duration-300 hover:scale-125`}
                />
              ))}
            </div>
          </CardContent>
        </AdvancedCard>
      </ScrollAnimation>

      <ScrollAnimation animation="slide-right">
        <AdvancedCard 
          variant="plasma" 
          hover 
          glow 
          pattern="wave" 
          animation="pulse"
          className="h-full"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-secondary" />
              Performance
            </CardTitle>
            <CardDescription>
              Optimized animations with 60fps smoothness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Render Speed</span>
                <span className="text-green-500">60fps</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full w-full animate-pulse" />
              </div>
            </div>
          </CardContent>
        </AdvancedCard>
      </ScrollAnimation>
    </div>
  );
}
