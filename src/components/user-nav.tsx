"use client";

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from '@/context/AuthContext';


export function UserNav() {
  const sidebar = useSidebar();
  const state = sidebar?.state ?? 'expanded';
  const router = useRouter();
  const { user, loading } = useAuth(); // Use the context

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }

  if (loading) {
     return (
        <div className={cn("flex items-center gap-3 p-2.5 h-12", state === 'collapsed' && 'p-0 justify-center items-center size-12' )}>
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className={cn("flex flex-col gap-2", state === 'collapsed' && 'hidden')}>
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-3 w-28" />
            </div>
        </div>
     )
  }
  
  if (!user) {
    // This case should ideally not be reached in an authenticated layout,
    // but it's good practice for robustness.
    return null;
  }
  
  const getInitials = (name: string) => {
    if(!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("w-full justify-start items-center gap-3 p-2.5 h-12", state === 'collapsed' && 'size-12 p-0 justify-center items-center' )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
           <div className={cn("flex flex-col items-start", state === 'collapsed' && 'hidden')}>
            <p className="text-sm font-medium leading-none text-sidebar-foreground">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            Faturamento
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
