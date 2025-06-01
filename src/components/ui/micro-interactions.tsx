import * as React from "react";
import { cn } from "@/lib/utils";
import styles from './MicroInteractions.module.css';

interface HoverRevealProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  variant?: "slide" | "fade" | "scale" | "rotate" | "flip";
  direction?: "up" | "down" | "left" | "right";
  speed?: "fast" | "normal" | "slow";
  trigger?: React.ReactNode;
  content: React.ReactNode;
}

const HoverReveal = React.forwardRef<HTMLDivElement, HoverRevealProps>(
  ({ 
    className, 
    variant = "slide",
    direction = "up",
    speed = "normal",
    trigger,
    content,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const speedClasses = {
      fast: "duration-150",
      normal: "duration-300",
      slow: "duration-500",
    };

    const variantClasses = {
      slide: {
        up: isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        down: isHovered ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
        left: isHovered ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
        right: isHovered ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
      },
      fade: {
        up: isHovered ? "opacity-100" : "opacity-0",
        down: isHovered ? "opacity-100" : "opacity-0",
        left: isHovered ? "opacity-100" : "opacity-0",
        right: isHovered ? "opacity-100" : "opacity-0",
      },
      scale: {
        up: isHovered ? "scale-100 opacity-100" : "scale-95 opacity-0",
        down: isHovered ? "scale-100 opacity-100" : "scale-95 opacity-0",
        left: isHovered ? "scale-100 opacity-100" : "scale-95 opacity-0",
        right: isHovered ? "scale-100 opacity-100" : "scale-95 opacity-0",
      },
      rotate: {
        up: isHovered ? "rotate-0 opacity-100" : "rotate-6 opacity-0",
        down: isHovered ? "rotate-0 opacity-100" : "-rotate-6 opacity-0",
        left: isHovered ? "rotate-0 opacity-100" : "rotate-3 opacity-0",
        right: isHovered ? "rotate-0 opacity-100" : "-rotate-3 opacity-0",
      },
      flip: {
        up: isHovered ? "rotateX-0 opacity-100" : "rotateX-90 opacity-0",
        down: isHovered ? "rotateX-0 opacity-100" : "rotateX-90 opacity-0",
        left: isHovered ? "rotateY-0 opacity-100" : "rotateY-90 opacity-0",
        right: isHovered ? "rotateY-0 opacity-100" : "rotateY-90 opacity-0",
      },
    };

    return (
      <div
        ref={ref}
        className={cn("relative group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {trigger}
        <div
          className={cn(
            "absolute z-10 transition-all",
            speedClasses[speed],
            variantClasses[variant][direction]
          )}
        >
          {content}
        </div>
      </div>
    );
  }
);

HoverReveal.displayName = "HoverReveal";

interface MagneticEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: "weak" | "normal" | "strong";
  children: React.ReactNode;
}

const MagneticEffect = React.forwardRef<HTMLDivElement, MagneticEffectProps>(
  ({ className, strength = "normal", children, ...props }, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    
    React.useImperativeHandle(ref, () => elementRef.current!);

    const strengthValues = {
      weak: 0.1,
      normal: 0.2,
      strong: 0.3,
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * strengthValues[strength];
      const moveY = y * strengthValues[strength];

      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      const element = elementRef.current;
      if (!element) return;
      element.style.transform = "translate(0px, 0px)";
    };

    return (
      <div
        ref={elementRef}
        className={cn("transition-transform duration-300 ease-out cursor-pointer", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MagneticEffect.displayName = "MagneticEffect";

interface RippleEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  duration?: number;
  children: React.ReactNode;
}

const RippleEffect = React.forwardRef<HTMLDivElement, RippleEffectProps>(
  ({ className, color = "rgba(255, 255, 255, 0.6)", duration = 600, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id));
      }, duration);
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onClick={handleClick}
        {...props}
      >
        {children}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x - 4,
              top: ripple.y - 4,
              width: 8,
              height: 8,
              backgroundColor: color,
              animationDuration: `${duration}ms`,
            }}
          />
        ))}
      </div>
    );
  }
);

RippleEffect.displayName = "RippleEffect";

interface TiltEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "subtle" | "normal" | "dramatic";
  children: React.ReactNode;
}

const TiltEffect = React.forwardRef<HTMLDivElement, TiltEffectProps>(
  ({ className, intensity = "normal", children, ...props }, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    
    React.useImperativeHandle(ref, () => elementRef.current!);

    const intensityValues = {
      subtle: 5,
      normal: 15,
      dramatic: 25,
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * intensityValues[intensity];
      const rotateY = (centerX - x) / centerX * intensityValues[intensity];

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      const element = elementRef.current;
      if (!element) return;
      element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    return (
      <div
        ref={elementRef}
        className={cn("transition-transform duration-300 ease-out", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TiltEffect.displayName = "TiltEffect";

interface FloatingElementProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "bubble" | "orbit" | "drift" | "bounce";
  speed?: "slow" | "normal" | "fast";
  direction?: "up" | "down" | "left" | "right" | "random";
  distance?: "small" | "medium" | "large";
  children: React.ReactNode;
}

const FloatingElement = React.forwardRef<HTMLDivElement, FloatingElementProps>(
  ({ 
    className, 
    variant = "drift",
    speed = "normal",
    direction = "random",
    distance = "medium",
    children,
    ...props 
  }, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    
    React.useImperativeHandle(ref, () => elementRef.current!);

    const speedValues = {
      slow: 4000,
      normal: 2000,
      fast: 1000,
    };

    const distanceValues = {
      small: 10,
      medium: 20,
      large: 30,
    };

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      let animationId: number;
      let startTime: number;
      const distanceValue = distanceValues[distance];

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % speedValues[speed]) / speedValues[speed];

        let x = 0;
        let y = 0;

        switch (variant) {
          case "bubble":
            y = Math.sin(progress * Math.PI * 2) * distanceValue;
            break;
          case "orbit":
            x = Math.cos(progress * Math.PI * 2) * distanceValue;
            y = Math.sin(progress * Math.PI * 2) * distanceValue;
            break;
          case "drift":
            x = Math.sin(progress * Math.PI * 2) * distanceValue * 0.5;
            y = Math.cos(progress * Math.PI * 2 * 0.7) * distanceValue;
            break;
          case "bounce":
            y = Math.abs(Math.sin(progress * Math.PI * 4)) * distanceValue;
            break;
        }

        if (direction === "up") y = -Math.abs(y);
        if (direction === "down") y = Math.abs(y);
        if (direction === "left") x = -Math.abs(x);
        if (direction === "right") x = Math.abs(x);

        element.style.transform = `translate(${x}px, ${y}px)`;
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [variant, speed, direction, distance]);

    return (
      <div
        ref={elementRef}
        className={cn("transition-transform duration-300 ease-out", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FloatingElement.displayName = "FloatingElement";

interface GlitchEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "subtle" | "normal" | "extreme";
  speed?: "slow" | "normal" | "fast";
  children: React.ReactNode;
}

const GlitchEffect = React.forwardRef<HTMLDivElement, GlitchEffectProps>(
  ({ className, intensity = "normal", speed = "normal", children, ...props }, ref) => {
    const [isGlitching, setIsGlitching] = React.useState(false);

    const intensityValues = {
      subtle: 2,
      normal: 5,
      extreme: 10,
    };

    const speedValues = {
      slow: 3000,
      normal: 2000,
      fast: 1000,
    };

    React.useEffect(() => {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }, speedValues[speed]);

      return () => clearInterval(interval);
    }, [speed]);

    const glitchStyle = isGlitching ? {
      transform: `translate(${Math.random() * intensityValues[intensity] - intensityValues[intensity]/2}px, ${Math.random() * intensityValues[intensity] - intensityValues[intensity]/2}px)`,
      filter: `hue-rotate(${Math.random() * 360}deg)`,
    } : {};

    return (
      <div
        ref={ref}
        className={cn("transition-all duration-100", className)}
        style={glitchStyle}
        {...props}
      >
        {children}
        {isGlitching && (
          <>
            <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-blue-500/20 mix-blend-multiply translate-x-1" />
            <div className="absolute inset-0 bg-green-500/20 mix-blend-multiply -translate-x-1" />
          </>
        )}
      </div>
    );
  }
);

GlitchEffect.displayName = "GlitchEffect";

export { 
  HoverReveal, 
  MagneticEffect, 
  RippleEffect, 
  TiltEffect, 
  FloatingElement,
  GlitchEffect 
};
