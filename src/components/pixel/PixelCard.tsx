import React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'pastel';
}

export const PixelCard = ({ children, className, variant = 'white' }: PixelCardProps) => {
  return (
    <div
      className={cn(
        'pixel-border p-6 bg-white transition-all duration-150',
        variant === 'pastel' && 'bg-primary/20',
        className
      )}
    >
      {children}
    </div>
  );
};
