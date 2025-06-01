
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const premiumButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/25 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        destructive: "bg-gradient-to-r from-destructive via-destructive/90 to-destructive text-destructive-foreground hover:shadow-2xl hover:shadow-destructive/25 hover:scale-105 active:scale-95",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-2xl hover:shadow-primary/25 hover:scale-105 active:scale-95 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-r before:from-primary/20 before:to-accent/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        secondary: "bg-gradient-to-r from-secondary via-secondary/90 to-secondary text-secondary-foreground hover:shadow-2xl hover:shadow-secondary/25 hover:scale-105 active:scale-95",
        ghost: "hover:bg-gradient-to-r hover:from-accent/50 hover:to-primary/50 hover:text-accent-foreground hover:scale-105 active:scale-95 hover:shadow-lg",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95 hover:text-accent transition-colors",
        gradient: "bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 bg-size-200 hover:bg-pos-100 transition-all duration-500",
        glow: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-75 before:blur-sm before:scale-105 before:-z-10",
        neon: "bg-transparent border-2 border-accent text-accent hover:text-accent-foreground hover:bg-accent hover:scale-105 active:scale-95 shadow-[0_0_20px_currentColor] hover:shadow-[0_0_40px_currentColor] transition-all duration-500",
        holographic: "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400 before:via-purple-500 before:to-pink-500 before:opacity-0 hover:before:opacity-100 before:blur-xl before:transition-opacity before:duration-500 bg-size-400 hover:bg-pos-100 animate-gradient",
        crystalline: "bg-white/10 backdrop-blur-xl border border-white/20 text-foreground hover:bg-white/20 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-primary/20 transition-all duration-500",
        plasma: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 active:scale-95 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:via-pink-500 before:to-red-500 before:opacity-50 before:blur-lg before:scale-110 before:-z-10 animate-pulse-slow",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
        xl: "h-16 rounded-2xl px-10 text-lg",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        float: "animate-float",
        glow: "animate-glow",
        shimmer: "animate-shimmer",
        morphing: "animate-morphing",
        holographic: "animate-holographic",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean;
  glowIntensity?: "low" | "medium" | "high";
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant, size, animation, glowIntensity = "medium", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const glowClasses = {
      low: "hover:shadow-lg",
      medium: "hover:shadow-xl",
      high: "hover:shadow-2xl",
    };

    return (
      <Comp
        className={cn(
          premiumButtonVariants({ variant, size, animation, className }),
          glowClasses[glowIntensity]
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 animate-gradient bg-size-400" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
        </div>
        
        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10" />
      </Comp>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export { PremiumButton, premiumButtonVariants };
