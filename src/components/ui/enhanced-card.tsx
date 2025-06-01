
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "elevated" | "bordered";
  hover?: boolean;
  glow?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", hover = false, glow = false, ...props }, ref) => {
    const cardVariants = {
      default: "bg-card text-card-foreground",
      glass: "bg-card/80 backdrop-blur-md border-border/50 text-card-foreground",
      gradient: "bg-gradient-to-br from-card via-card/95 to-muted/30 text-card-foreground",
      elevated: "bg-card text-card-foreground shadow-lg",
      bordered: "bg-card text-card-foreground border-2 border-border/50",
    };

    const hoverEffects = hover ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" : "";
    const glowEffect = glow ? "shadow-2xl shadow-primary/20" : "";

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border",
          cardVariants[variant],
          hoverEffects,
          glowEffect,
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn("relative z-10", className)}
    {...props}
  />
));

EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn("text-xl font-semibold tracking-tight", className)}
    {...props}
  />
));

EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn("text-sm opacity-80", className)}
    {...props}
  />
));

EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("relative z-10", className)}
    {...props}
  />
));

EnhancedCardContent.displayName = "EnhancedCardContent";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
};
