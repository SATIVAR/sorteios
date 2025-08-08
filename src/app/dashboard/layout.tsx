import { Home, Settings, Ticket, Users, Briefcase } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Painel">
                  <Link href="/dashboard">
                    <Home />
                    <span>Painel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive tooltip="Sorteios">
                  <Link href="#">
                    <Ticket />
                    <span>Sorteios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Participantes">
                  <Link href="#">
                    <Users />
                    <span>Participantes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Resultados">
                  <Link href="#">
                    <Briefcase />
                    <span>Resultados</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <UserNav />
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 h-[65px]">
              <div className="flex items-center gap-2">
                   <SidebarTrigger />
                   <h1 className="text-2xl font-bold font-headline hidden md:block">SATIVAR</h1>
              </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8 bg-muted/40 flex-1">
              {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
