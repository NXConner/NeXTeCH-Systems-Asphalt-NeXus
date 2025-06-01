
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dot" | "square" | "triangle" | "circle";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "muted";
  animate?: boolean;
}

const FloatingElement = React.forwardRef<HTMLDivElement, FloatingElementProps>(
  ({ className, variant = "dot", size = "md", color = "primary", animate = true, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-4 h-4",
      lg: "w-6 h-6",
    };

    const colorClasses = {
      primary: "bg-primary/20",
      secondary: "bg-secondary/20",
      accent: "bg-accent/20",
      muted: "bg-muted/20",
    };

    const variantClasses = {
      dot: "rounded-full",
      square: "rounded-none",
      triangle: "rounded-none",
      circle: "rounded-full border-2 border-current",
    };

    const animationClass = animate ? "animate-pulse" : "";

    return (
      <div
        ref={ref}
        className={cn(
          "absolute opacity-60",
          sizeClasses[size],
          colorClasses[color],
          variantClasses[variant],
          animationClass,
          className
        )}
        {...props}
      />
    );
  }
);

FloatingElement.displayName = "FloatingElement";

interface FloatingBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: "low" | "medium" | "high";
  variant?: "dots" | "geometric" | "mixed";
}

const FloatingBackground = React.forwardRef<HTMLDivElement, FloatingBackgroundProps>(
  ({ className, density = "medium", variant = "dots", ...props }, ref) => {
    const elementCount = {
      low: 8,
      medium: 15,
      high: 25,
    };

    const count = elementCount[density];

    const generateElements = () => {
      const elements = [];
      for (let i = 0; i < count; i++) {
        const variants = variant === "mixed" 
          ? ["dot", "square", "triangle", "circle"]
          : [variant === "geometric" ? "square" : "dot"];
        
        const sizes = ["sm", "md", "lg"];
        const colors = ["primary", "secondary", "accent", "muted"];
        
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const style = {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        };

        elements.push(
          <FloatingElement
            key={i}
            variant={randomVariant as any}
            size={randomSize as any}
            color={randomColor as any}
            style={style}
            animate={true}
          />
        );
      }
      return elements;
    };

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
        {...props}
      >
        {generateElements()}
      </div>
    );
  }
);

FloatingBackground.displayName = "FloatingBackground";

export { FloatingElement, FloatingBackground };
