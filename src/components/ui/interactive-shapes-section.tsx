
import * as React from "react";
import { ScrollAnimation } from "./animation-presets";
import { FloatingElement, GlitchEffect } from "./micro-interactions";
import { MorphingShape } from "./morphing-shape";

export function InteractiveShapesSection() {
  return (
    <ScrollAnimation animation="slide-up" className="flex justify-center items-center gap-8 py-12">
      <FloatingElement variant="orbit" speed="slow" distance="medium">
        <MorphingShape variant="blob" color="gradient" animation="morph" interactive />
      </FloatingElement>
      <FloatingElement variant="bounce" speed="normal" distance="small">
        <MorphingShape variant="star" color="rainbow" animation="rotate" interactive />
      </FloatingElement>
      <FloatingElement variant="drift" speed="fast" distance="large">
        <MorphingShape variant="spiral" color="primary" animation="pulse" interactive />
      </FloatingElement>
      <GlitchEffect intensity="subtle" speed="slow">
        <MorphingShape variant="heart" color="accent" animation="float" interactive />
      </GlitchEffect>
    </ScrollAnimation>
  );
}
