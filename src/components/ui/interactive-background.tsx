
import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "particles" | "waves" | "geometric" | "aurora" | "matrix" | "constellation" | "plasma" | "neural";
  density?: "low" | "medium" | "high";
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
}

const InteractiveBackground = React.forwardRef<HTMLDivElement, InteractiveBackgroundProps>(
  ({ 
    className, 
    variant = "particles", 
    density = "medium", 
    speed = "normal",
    interactive = true,
    ...props 
  }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!interactive) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          });
        }
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener('mousemove', handleMouseMove);
        return () => container.removeEventListener('mousemove', handleMouseMove);
      }
    }, [interactive]);

    const generateElements = () => {
      const counts = {
        low: 20,
        medium: 50,
        high: 100,
      };

      const count = counts[density];
      const elements = [];

      for (let i = 0; i < count; i++) {
        const delay = Math.random() * 5;
        const duration = speed === "slow" ? 8 + Math.random() * 4 : 
                        speed === "fast" ? 2 + Math.random() * 2 : 
                        4 + Math.random() * 3;
        
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          transform: interactive ? 
            `translate(${mousePosition.x * 20 - 10}px, ${mousePosition.y * 20 - 10}px)` : 
            undefined,
        };

        let elementClass = "";
        
        switch (variant) {
          case "particles":
            elementClass = "w-1 h-1 bg-primary/30 rounded-full animate-float";
            break;
          case "waves":
            elementClass = "w-8 h-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-pulse";
            break;
          case "geometric":
            elementClass = `w-2 h-2 border border-primary/20 ${Math.random() > 0.5 ? 'rounded-full' : 'rotate-45'} animate-spin`;
            break;
          case "aurora":
            elementClass = "w-16 h-16 bg-gradient-radial from-primary/10 to-transparent rounded-full animate-pulse";
            break;
          case "matrix":
            elementClass = "w-0.5 h-8 bg-gradient-to-b from-accent/40 to-transparent animate-pulse";
            break;
          case "constellation":
            elementClass = "w-1 h-1 bg-accent/50 rounded-full animate-glow";
            break;
          case "plasma":
            elementClass = "w-6 h-6 bg-gradient-radial from-purple-500/20 to-transparent rounded-full animate-morphing";
            break;
          case "neural":
            elementClass = "w-0.5 h-12 bg-gradient-to-b from-primary/30 via-accent/30 to-transparent animate-shimmer";
            break;
        }

        elements.push(
          <div
            key={i}
            className={cn("absolute pointer-events-none transition-transform duration-1000", elementClass)}
            style={style}
          />
        );
      }

      return elements;
    };

    const variantBackgrounds = {
      particles: "bg-gradient-to-br from-background via-background/95 to-muted/10",
      waves: "bg-gradient-to-b from-background via-primary/5 to-background",
      geometric: "bg-gradient-to-br from-background via-background to-accent/5",
      aurora: "bg-gradient-to-br from-background via-primary/5 to-accent/5",
      matrix: "bg-gradient-to-b from-background to-accent/10",
      constellation: "bg-gradient-radial from-background via-background to-primary/10",
      plasma: "bg-gradient-to-br from-background via-purple-500/5 to-pink-500/5",
      neural: "bg-gradient-to-br from-background via-primary/5 to-accent/10",
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 overflow-hidden pointer-events-none",
          variantBackgrounds[variant],
          className
        )}
        {...props}
      >
        {generateElements()}
        
        {/* Additional overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/50" />
        
        {interactive && (
          <div 
            className="absolute w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
            style={{
              left: `${mousePosition.x * 100}%`,
              top: `${mousePosition.y * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
    );
  }
);

InteractiveBackground.displayName = "InteractiveBackground";

export { InteractiveBackground };
