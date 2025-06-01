
import * as React from "react";
import { ScrollAnimation } from "./animation-presets";
import { GradientText } from "./gradient-text";

export function TypographyEffectsShowcase() {
  return (
    <ScrollAnimation animation="fade-in" className="text-center space-y-8">
      <h2 className="text-2xl font-bold mb-6">Typography Effects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <GradientText variant="rainbow" animation="flow" size="xl" weight="bold">
            Rainbow Flow
          </GradientText>
          <GradientText variant="cosmic" animation="shimmer" size="lg" weight="semibold">
            Cosmic Shimmer
          </GradientText>
          <GradientText variant="neon" animation="glow" size="lg" weight="bold">
            Neon Glow
          </GradientText>
        </div>
        <div className="space-y-4">
          <GradientText variant="plasma" animation="pulse" size="xl" weight="bold">
            Plasma Pulse
          </GradientText>
          <GradientText variant="aurora" animation="wave" size="lg" weight="semibold">
            Aurora Wave
          </GradientText>
          <GradientText variant="holographic" animation="glitch" size="lg" weight="bold">
            Holographic Glitch
          </GradientText>
        </div>
      </div>
    </ScrollAnimation>
  );
}
