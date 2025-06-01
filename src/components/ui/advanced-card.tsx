
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdvancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "elevated" | "bordered" | "neon" | "holographic" | "crystalline" | "metallic" | "plasma";
  hover?: boolean;
  glow?: boolean;
  pattern?: "none" | "dots" | "grid" | "diagonal" | "hexagon" | "circuit" | "wave" | "noise" | "fabric";
  animation?: "none" | "float" | "pulse" | "glow" | "shimmer" | "morphing" | "holographic";
}

const AdvancedCard = React.forwardRef<HTMLDivElement, AdvancedCardProps>(
  ({ 
    className, 
    variant = "default", 
    hover = false, 
    glow = false, 
    pattern = "none",
    animation = "none",
    children,
    ...props 
  }, ref) => {
    const cardVariants = {
      default: "bg-card text-card-foreground border-border/50",
      glass: "bg-card/60 backdrop-blur-xl border-border/30 text-card-foreground shadow-2xl",
      gradient: "bg-gradient-to-br from-card via-card/95 to-muted/30 text-card-foreground border-border/50",
      elevated: "bg-card text-card-foreground shadow-2xl border-border/30",
      bordered: "bg-card text-card-foreground border-2 border-primary/20 shadow-lg",
      neon: "bg-card/80 text-card-foreground border-2 border-accent shadow-[0_0_20px_hsl(var(--accent)/0.3)]",
      holographic: "bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 text-card-foreground shadow-2xl",
      crystalline: "bg-white/5 backdrop-blur-2xl border border-white/10 text-card-foreground shadow-2xl",
      metallic: "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-card-foreground border border-slate-300 dark:border-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
      plasma: "bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 backdrop-blur-xl border border-purple-400/30 text-card-foreground shadow-2xl",
    };

    const patternClasses = {
      none: "",
      dots: "bg-[radial-gradient(circle,rgba(var(--foreground)/0.1)_1px,transparent_1px)] bg-[size:20px_20px]",
      grid: "bg-[linear-gradient(rgba(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--foreground)/0.05)_1px,transparent_1px)] bg-[size:20px_20px]",
      diagonal: "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(var(--foreground)/0.03)_10px,rgba(var(--foreground)/0.03)_20px)]",
      hexagon: "bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(var(--foreground)/0.05)_21%,rgba(var(--foreground)/0.05)_25%,transparent_26%)] bg-[size:30px_30px]",
      circuit: "bg-[linear-gradient(90deg,rgba(var(--accent)/0.1)_50%,transparent_50%),linear-gradient(rgba(var(--accent)/0.1)_50%,transparent_50%)] bg-[size:20px_20px]",
      wave: "bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(var(--primary)/0.1)_10px,rgba(var(--primary)/0.1)_20px)]",
      noise: "bg-[url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')]",
      fabric: "bg-[repeating-linear-gradient(45deg,rgba(var(--foreground)/0.02),rgba(var(--foreground)/0.02)_2px,transparent_2px,transparent_6px)]",
    };

    const animationClasses = {
      none: "",
      float: "animate-float",
      pulse: "animate-pulse-slow",
      glow: "animate-glow",
      shimmer: "animate-shimmer",
      morphing: "animate-morphing",
      holographic: "animate-holographic",
    };

    const hoverEffects = hover ? "transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2" : "";
    const glowEffect = glow ? "shadow-2xl shadow-primary/20 hover:shadow-primary/40" : "";

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border backdrop-blur-sm",
          cardVariants[variant],
          patternClasses[pattern],
          animationClasses[animation],
          hoverEffects,
          glowEffect,
          className
        )}
        {...props}
      >
        {/* Enhanced background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Hover overlay */}
        {hover && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
      </Card>
    );
  }
);

AdvancedCard.displayName = "AdvancedCard";

const AdvancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn("relative z-10 pb-3", className)}
    {...props}
  />
));

AdvancedCardHeader.displayName = "AdvancedCardHeader";

const AdvancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn("text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text", className)}
    {...props}
  />
));

AdvancedCardTitle.displayName = "AdvancedCardTitle";

const AdvancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
));

AdvancedCardDescription.displayName = "AdvancedCardDescription";

const AdvancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("relative z-10 pt-0", className)}
    {...props}
  />
));

AdvancedCardContent.displayName = "AdvancedCardContent";

export {
  AdvancedCard,
  AdvancedCardHeader,
  AdvancedCardTitle,
  AdvancedCardDescription,
  AdvancedCardContent,
};
