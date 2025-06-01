import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimationPresetsProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: "float" | "glow" | "shimmer" | "morphing" | "holographic" | "glitch" | "typewriter" | "gradient" | "wave" | "pulse-slow" | "bounce-gentle" | "wiggle" | "shake" | "flip" | "slide-fade" | "zoom-fade" | "rotate-fade";
  duration?: "fast" | "normal" | "slow" | "ultra-slow";
  delay?: number;
  infinite?: boolean;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

const AnimationPresets = React.forwardRef<HTMLDivElement, AnimationPresetsProps>(
  ({ 
    className, 
    preset = "float", 
    duration = "normal",
    delay = 0,
    infinite = false,
    children,
    ...props 
  }, ref) => {
    const durationClasses = {
      fast: "animate-duration-500",
      normal: "animate-duration-1000",
      slow: "animate-duration-2000",
      "ultra-slow": "animate-duration-4000",
    };

    const presetClasses = {
      float: "animate-float",
      glow: "animate-glow",
      shimmer: "animate-shimmer",
      morphing: "animate-morphing",
      holographic: "animate-holographic",
      glitch: "animate-glitch",
      typewriter: "animate-typewriter",
      gradient: "animate-gradient",
      wave: "animate-wave",
      "pulse-slow": "animate-pulse-slow",
      "bounce-gentle": "animate-bounce-gentle",
      wiggle: "animate-wiggle",
      shake: "animate-shake",
      flip: "animate-flip",
      "slide-fade": "animate-slide-fade",
      "zoom-fade": "animate-zoom-fade",
      "rotate-fade": "animate-rotate-fade",
    };

    const animationStyle = {
      animationDelay: `${delay}ms`,
      animationIterationCount: infinite ? 'infinite' : '1',
    };

    const validRoles = [
      'presentation', 'region', 'none', 'group', 'status', 'alert', 'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          presetClasses[preset],
          durationClasses[duration],
          className
        )}
        style={animationStyle}
        {...(validRoles.includes(props.role as string) ? { role: props.role } : {})}
        tabIndex={props.tabIndex}
        aria-label={props["aria-label"]}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimationPresets.displayName = "AnimationPresets";

// Animation trigger component for scroll-based animations
interface ScrollAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade-in" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "rotate-in" | "flip-up";
  threshold?: number;
  once?: boolean;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

const ScrollAnimation = React.forwardRef<HTMLDivElement, ScrollAnimationProps>(
  ({ 
    className, 
    animation = "fade-in", 
    threshold = 0.1,
    once = true,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { threshold }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, [threshold, once]);

    React.useImperativeHandle(ref, () => elementRef.current!);

    const animationClasses = {
      "fade-in": isVisible ? "animate-fade-in" : "opacity-0",
      "slide-up": isVisible ? "animate-slide-up" : "opacity-0 translate-y-8",
      "slide-down": isVisible ? "animate-slide-down" : "opacity-0 -translate-y-8",
      "slide-left": isVisible ? "animate-slide-left" : "opacity-0 translate-x-8",
      "slide-right": isVisible ? "animate-slide-right" : "opacity-0 -translate-x-8",
      "zoom-in": isVisible ? "animate-zoom-in" : "opacity-0 scale-95",
      "zoom-out": isVisible ? "animate-zoom-out" : "opacity-0 scale-105",
      "rotate-in": isVisible ? "animate-rotate-in" : "opacity-0 rotate-12",
      "flip-up": isVisible ? "animate-flip-up" : "opacity-0 rotateX-90",
    };

    const validRoles = [
      'presentation', 'region', 'none', 'group', 'status', 'alert', 'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'
    ];

    return (
      <div
        ref={elementRef}
        className={cn(
          "transition-all duration-700 ease-out",
          animationClasses[animation],
          className
        )}
        {...(validRoles.includes(props.role as string) ? { role: props.role } : {})}
        tabIndex={props.tabIndex}
        aria-label={props["aria-label"]}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollAnimation.displayName = "ScrollAnimation";

export { AnimationPresets, ScrollAnimation };
