
import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "rainbow" | "sunset" | "ocean" | "fire" | "neon" | "cosmic" | "aurora" | "plasma" | "holographic" | "liquid";
  animation?: "none" | "flow" | "pulse" | "shimmer" | "wave" | "glow" | "typewriter" | "glitch";
  speed?: "slow" | "normal" | "fast";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ 
    className, 
    variant = "rainbow", 
    animation = "none",
    speed = "normal",
    size = "md",
    weight = "normal",
    children,
    ...props 
  }, ref) => {
    const gradients = {
      rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500",
      sunset: "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500",
      ocean: "bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500",
      fire: "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400",
      neon: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500",
      cosmic: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-400",
      aurora: "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600",
      plasma: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
      holographic: "bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-yellow-400",
      liquid: "bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-red-600",
    };

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    };

    const weightClasses = {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    const speedClasses = {
      slow: "animate-duration-[6s]",
      normal: "animate-duration-[3s]",
      fast: "animate-duration-[1.5s]",
    };

    const animationClasses = {
      none: "",
      flow: "bg-size-200 animate-gradient",
      pulse: "animate-pulse",
      shimmer: "animate-shimmer bg-size-200",
      wave: "animate-wave",
      glow: "animate-glow drop-shadow-[0_0_10px_currentColor]",
      typewriter: "animate-typewriter overflow-hidden whitespace-nowrap border-r-2 border-current",
      glitch: "animate-glitch relative",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-block bg-clip-text text-transparent",
          gradients[variant],
          sizeClasses[size],
          weightClasses[weight],
          speedClasses[speed],
          animationClasses[animation],
          className
        )}
        {...props}
      >
        {children}
        {animation === "glitch" && (
          <>
            <span className="absolute top-0 left-0 text-red-500 opacity-70 animate-glitch-1">{children}</span>
            <span className="absolute top-0 left-0 text-blue-500 opacity-70 animate-glitch-2">{children}</span>
          </>
        )}
      </span>
    );
  }
);

GradientText.displayName = "GradientText";

export { GradientText };
