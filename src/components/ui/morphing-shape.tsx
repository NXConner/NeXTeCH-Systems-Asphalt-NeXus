import * as React from "react";
import { cn } from "@/lib/utils";
import styles from './MorphingShape.module.css';

interface MorphingShapeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blob" | "polygon" | "star" | "heart" | "spiral" | "wave" | "DNA" | "infinity";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "gradient" | "rainbow";
  animation?: "morph" | "rotate" | "pulse" | "float" | "bounce" | "spin" | "wiggle";
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

const validRoles = [
  'presentation', 'region', 'none', 'group', 'status', 'alert', 'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'
];

const MorphingShape = React.forwardRef<HTMLDivElement, MorphingShapeProps & { role?: string; tabIndex?: number; "aria-label"?: string }>(
  ({ 
    className, 
    variant = "blob", 
    size = "md",
    color = "primary",
    animation = "morph",
    speed = "normal",
    interactive = false,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const sizeClasses = {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
      xl: "w-48 h-48",
    };

    const colorClasses = {
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      gradient: "bg-gradient-to-br from-primary via-accent to-secondary",
      rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
    };

    const speedClasses = {
      slow: "animate-duration-[6s]",
      normal: "animate-duration-[3s]",
      fast: "animate-duration-[1s]",
    };

    const shapeStyles = {
      blob: {
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        transform: "rotate(0deg)",
      },
      polygon: {
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      },
      star: {
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      },
      heart: {
        clipPath: "path('M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z')",
      },
      spiral: {
        background: `conic-gradient(from 0deg, ${color === 'rainbow' ? '#ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080' : 'currentColor, transparent'})`,
        borderRadius: "50%",
      },
      wave: {
        clipPath: "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
      },
      DNA: {
        background: `linear-gradient(45deg, ${color === 'gradient' ? 'var(--primary), var(--accent)' : 'currentColor'} 25%, transparent 25%), linear-gradient(-45deg, ${color === 'gradient' ? 'var(--primary), var(--accent)' : 'currentColor'} 25%, transparent 25%)`,
        backgroundSize: "8px 8px",
      },
      infinity: {
        clipPath: "path('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z')",
      },
    };

    const animationClasses = {
      morph: "animate-morphing",
      rotate: "animate-spin",
      pulse: "animate-pulse",
      float: "animate-float",
      bounce: "animate-bounce",
      spin: "animate-spin",
      wiggle: "animate-wiggle",
    };

    const interactiveStyles = interactive && isHovered ? {
      transform: "scale(1.1)",
      filter: "brightness(1.2) saturate(1.3)",
    } : {};

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-block transition-all duration-500",
          sizeClasses[size],
          colorClasses[color],
          speedClasses[speed],
          animationClasses[animation],
          interactive && "cursor-pointer hover:scale-110",
          className,
          styles.shape
        )}
        style={{
          ...shapeStyles[variant],
          ...interactiveStyles,
        }}
        {...(validRoles.includes(role as string) ? { role } : {})}
        tabIndex={typeof tabIndex === 'number' ? tabIndex : interactive ? 0 : undefined}
        aria-label={ariaLabel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Glow effect */}
        <div className={styles.glowEffect} style={shapeStyles[variant]} />
        {/* Inner light */}
        <div className="absolute inset-2 bg-white/20 rounded-full animate-ping" />
      </div>
    );
  }
);

MorphingShape.displayName = "MorphingShape";

export { MorphingShape };
