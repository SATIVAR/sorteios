"use client";

import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
  logoColor?: string;
  textColor?: string;
}

export function Logo({ 
  className, 
  showText: showTextProp = true,
  logoColor = 'bg-primary text-primary-foreground',
  textColor = 'text-2xl font-bold font-headline tracking-tighter whitespace-nowrap'
}: LogoProps) {
  const sidebar = useSidebar();
  const state = sidebar?.state ?? 'expanded';

  // The `showText` prop can be overridden by the sidebar state if inside a sidebar.
  const showText = sidebar ? showTextProp && state === 'expanded' : showTextProp;

  return (
    <Link href="/"
      className={cn(
        'flex items-center gap-3 transition-all duration-300 ease-in-out',
        sidebar && (state === 'expanded' ? 'justify-start' : 'justify-center'),
        className
      )}
    >
      <div className={cn('p-2 rounded-lg', logoColor)}>
        <Leaf className="h-6 w-6" />
      </div>
      {showText && (
         <span className={cn(
            textColor,
            sidebar && "transition-opacity duration-200",
            sidebar && (state === 'expanded' ? "opacity-100" : "opacity-0 hidden")
            )}>
            SATIVAR
          </span>
      )}
    </Link>
  );
}
