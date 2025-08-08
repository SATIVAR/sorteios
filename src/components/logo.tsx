import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const textColor = "text-white";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className='bg-sidebar-primary p-2 rounded-lg'>
        <Leaf className="h-6 w-6 text-sidebar-primary-foreground" />
      </div>
      <span className={cn(
        "text-2xl font-bold font-headline tracking-tighter",
        "group-data-[sidebar=sidebar]:group-data-[state=expanded]:text-sidebar-foreground",
        "group-data-[sidebar=sidebar]:group-data-[state=collapsed]:hidden"
        )}>
        SATIVAR
      </span>
    </div>
  );
}
