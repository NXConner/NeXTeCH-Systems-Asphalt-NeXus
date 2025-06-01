import * as React from "react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface ParticleSystemProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "stars" | "bubbles" | "fireflies" | "matrix" | "cosmic" | "neural" | "quantum" | "plasma";
  density?: "sparse" | "normal" | "dense";
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  connections?: boolean;
}

const ParticleSystem = React.forwardRef<HTMLDivElement, ParticleSystemProps>(
  ({ 
    className, 
    variant = "stars", 
    density = "normal", 
    speed = "normal",
    interactive = true,
    connections = false,
    ...props 
  }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const animationRef = React.useRef<number>();
    const particlesRef = React.useRef<Particle[]>([]);
    const mouseRef = React.useRef({ x: 0, y: 0 });

    const densityMap = {
      sparse: 25,
      normal: 50,
      dense: 100,
    };

    const speedMap = {
      slow: 0.3,
      normal: 0.6,
      fast: 1.2,
    };

    const createParticle = React.useCallback((canvas: HTMLCanvasElement, index: number): Particle => {
      const colors = {
        stars: ['#ffffff', '#ffffcc', '#ffcccc', '#ccccff'],
        bubbles: ['#00ffff', '#0080ff', '#8000ff', '#ff00ff'],
        fireflies: ['#ffff00', '#ffcc00', '#ff8800', '#00ff88'],
        matrix: ['#00ff00', '#88ff88', '#00cc00', '#ccffcc'],
        cosmic: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'],
        neural: ['#0080ff', '#8000ff', '#ff0080', '#00ff80'],
        quantum: ['#ff00ff', '#00ffff', '#8000ff', '#ff8000'],
        plasma: ['#ff0080', '#8000ff', '#00ff80', '#ff8000'],
      };

      return {
        id: index,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedMap[speed],
        vy: (Math.random() - 0.5) * speedMap[speed],
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[variant][Math.floor(Math.random() * colors[variant].length)],
        trail: [],
      };
    }, [variant, speed]);

    const initParticles = React.useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const particleCount = densityMap[density];
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => 
        createParticle(canvas, i)
      );
    }, [density, createParticle]);

    const updateParticle = React.useCallback((particle: Particle, canvas: HTMLCanvasElement) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Add to trail
      if (variant === "fireflies" || variant === "cosmic") {
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 5) {
          particle.trail.shift();
        }
      }

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Keep in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      // Interactive effect
      if (interactive) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }
      }
    }, [variant, interactive]);

    const drawParticle = React.useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;

      // Draw trail
      if (particle.trail.length > 1) {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        for (let i = 1; i < particle.trail.length; i++) {
          ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
        }
        ctx.stroke();
      }

      // Draw particle
      ctx.fillStyle = particle.color;
      
      if (variant === "stars") {
        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const x = particle.x + Math.cos(angle) * particle.size;
          const y = particle.y + Math.sin(angle) * particle.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.fill();
      } else if (variant === "matrix") {
        // Matrix-style rectangles
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size * 3
        );
      } else {
        // Circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }, [variant]);

    const drawConnections = React.useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      if (!connections) return;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.globalAlpha = 1 - (distance / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }, [connections]);

    const animate = React.useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle, canvas);
        drawParticle(ctx, particle);
      });

      drawConnections(ctx, particlesRef.current);

      animationRef.current = requestAnimationFrame(animate);
    }, [updateParticle, drawParticle, drawConnections]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initParticles();
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.addEventListener('mousemove', handleMouseMove);
      }

      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (interactive) {
          canvas.removeEventListener('mousemove', handleMouseMove);
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [initParticles, animate, interactive]);

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        />
      </div>
    );
  }
);

ParticleSystem.displayName = "ParticleSystem";

export { ParticleSystem };
