import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface EnhancedModuleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'active' | 'inactive' | 'warning' | 'error';
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'bordered';
  hover?: boolean;
  glow?: boolean;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
}

const statusColors = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20'
};

const variants = {
  default: 'bg-card text-card-foreground border border-border/10 shadow-md',
  glass: 'bg-card/80 backdrop-blur-md border border-border/10 text-card-foreground shadow-md',
  gradient: 'bg-gradient-to-br from-card via-card/95 to-muted/30 text-card-foreground border border-border/10 shadow-md',
  elevated: 'bg-card text-card-foreground shadow-lg border border-border/10',
  bordered: 'bg-card text-card-foreground border-2 border-border shadow-md'
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  }
};

export const EnhancedModule = React.forwardRef<HTMLDivElement, EnhancedModuleProps>(
  ({ 
    className, 
    title, 
    description, 
    icon, 
    status, 
    variant = 'default',
    hover = false,
    glow = false,
    actions,
    footer,
    loading,
    error,
    children,
    ...props 
  }, ref) => {
    const hoverEffects = hover ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl' : '';
    const glowEffect = glow ? 'shadow-2xl shadow-primary/20' : '';

    return (
      <AnimatePresence mode="wait">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'relative overflow-hidden rounded-xl',
            variants[variant],
            hoverEffects,
            glowEffect,
            className
          )}
          {...props}
        >
          {/* Background Effects */}
          {variant === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          )}
          {glow && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-pulse pointer-events-none" />
          )}

          {/* Content */}
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2 rounded-lg bg-primary/10"
                  >
                    {icon}
                  </motion.div>
                )}
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    {title}
                  </CardTitle>
                  {description && (
                    <CardDescription className="mt-1">
                      {description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {status && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "px-2 py-1 rounded-full transition-colors duration-200",
                        statusColors[status]
                      )}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </motion.div>
                )}
                {actions}
              </div>
            </div>
          </CardHeader>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <CardContent className="relative">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-8 h-8 text-primary/60" />
                  </motion.div>
                </div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              ) : (
                children
              )}
            </CardContent>
          </motion.div>

          {footer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-6 py-4 bg-muted/5 border-t border-border/5"
            >
              {footer}
            </motion.div>
          )}

          {/* Hover Effect Overlay */}
          {hover && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </motion.div>
      </AnimatePresence>
    );
  }
);

EnhancedModule.displayName = 'EnhancedModule';

export const ModuleGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
      {...props}
    />
  )
);

ModuleGrid.displayName = 'ModuleGrid';

export const ModuleSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'space-y-6',
        className
      )}
      {...props}
    />
  )
);

ModuleSection.displayName = 'ModuleSection'; 