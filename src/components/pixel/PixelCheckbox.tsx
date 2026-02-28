import React from 'react';
import { cn } from '@/lib/utils';
import { PixelCheckIcon } from './PixelIcons';

interface PixelCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  className?: string;
}

export const PixelCheckbox = ({ checked, onToggle, className }: PixelCheckboxProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-8 h-8 pixel-border-sm flex items-center justify-center transition-all duration-75',
        checked ? 'bg-primary' : 'bg-white',
        className
      )}
    >
      {checked && <PixelCheckIcon className="w-5 h-5 text-primary-foreground" />}
    </button>
  );
};
