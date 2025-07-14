"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Handshake,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Clock,
  MessageSquareQuote,
  Contact,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DataProvider } from "@/context/data-context";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/instansi", label: "Instansi", icon: Building2 },
  { href: "/dashboard/contracts", label: "Kontrak", icon: Handshake },
  { href: "/dashboard/updates", label: "Status Updates", icon: MessageSquareQuote },
  { href: "/dashboard/pic", label: "PIC", icon: Contact },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DataProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center gap-2">
              <Logo className="size-7 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                K/L Monitor
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <div className="flex items-center gap-3 p-2 rounded-md transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/40x40.png" alt="@g-anugrah" data-ai-hint="profile picture" />
                <AvatarFallback>GA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="font-semibold text-sidebar-foreground">Genta Anugrah</span>
                <span className="text-xs text-sidebar-foreground/70">PIC GA</span>
              </div>
              <Link href="/login" className="ml-auto">
                  <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <LogOut className="w-4 h-4" />
                  </Button>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex justify-end p-2 md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  );
}
