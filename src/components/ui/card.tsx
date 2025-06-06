import React from 'react';

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 border-b border-zinc-200 dark:border-zinc-700 font-semibold text-lg ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-xl font-bold ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</div>;
}
