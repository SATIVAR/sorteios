"use client";

import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

export function Logo({ className, showText: showTextProp = true }: { className?: string; showText?: boolean }) {
  const sidebar = useSidebar();
  const state = sidebar?.state ?? 'expanded';

  // The `showText` prop can be overridden by the sidebar state.
  const showText = showTextProp && state === 'expanded';

  return (
    <div
      className={cn(
        'flex items-center gap-3 transition-all duration-300 ease-in-out',
        state === 'expanded' ? 'justify-start' : 'justify-center',
        className
      )}
    >
      <div className={cn('bg-primary text-primary-foreground p-2 rounded-lg')}>
        <Leaf className="h-6 w-6" />
      </div>
      {showTextProp && (
         <span className={cn(
            "text-2xl font-bold font-headline tracking-tighter whitespace-nowrap transition-opacity duration-200",
            state === 'expanded' ? "opacity-100" : "opacity-0 hidden"
            )}>
            SATIVAR
          </span>
      )}
    </div>
  );
}