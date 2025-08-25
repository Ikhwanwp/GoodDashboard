

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Handshake,
  LayoutDashboard,
  LogOut,
  Users,
  Clock,
  MessageSquareQuote,
  Contact,
  Loader2,
  ChevronsRight,
  BookOpen,
  Shield,
  View,
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
import { DataProvider, useData } from "@/context/data-context";
import { useEffect } from "react";

const adminMenuItems = [
  { href: "/admin", label: "Command Center", icon: Shield },
];

const gaMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/instansi", label: "Instansi", icon: Building2 },
  { href: "/dashboard/contracts", label: "Kontrak", icon: Handshake },
  { href: "/dashboard/updates", label: "Status Updates", icon: MessageSquareQuote },
  { href: "/dashboard/fulfillment", label: "Tracking Invoice", icon: ChevronsRight },
  { href: "/dashboard/pic", label: "PIC", icon: Contact },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
];

const baMenuItems = [];

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, loading, logout } = useData();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
      return;
    }
    
    if (currentUser) {
      const isBaPath = pathname.startsWith('/dashboard-ba');
      const isAdminPath = pathname.startsWith('/admin');

      if (currentUser.role === 'Admin' && !isAdminPath) {
        router.push('/admin');
      }
      else if (currentUser.role === 'BA' && !isBaPath) {
        router.push('/dashboard-ba');
      } 
      else if (currentUser.role === 'GA' && (isBaPath || isAdminPath)) {
         router.push('/dashboard');
      }
      // New logic to protect admin routes
      else if (currentUser.role !== 'Admin' && isAdminPath) {
        router.push('/dashboard');
      }
    }
  }, [currentUser, loading, router, pathname]);

  if (loading || !currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  }
  
  let menuItems;
  let logoText;
  let homePath;

  const isViewingAsAdmin = currentUser.role === 'Admin' && (pathname.startsWith('/dashboard') || pathname.startsWith('/dashboard-ba'));

  // Determine which menu to show
  if (currentUser.role === 'Admin' && !isViewingAsAdmin) {
    menuItems = adminMenuItems;
    logoText = "Admin Center";
    homePath = "/admin";
  } else if (currentUser.role === 'BA' || (isViewingAsAdmin && pathname.startsWith('/dashboard-ba'))) {
    menuItems = baMenuItems;
    logoText = "BA Monitor";
    homePath = "/dashboard-ba";
  } else { // GA or Admin viewing GA
    menuItems = gaMenuItems;
    logoText = "Govtech Dashboard";
    homePath = "/dashboard";
  }


  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
             <Link href={homePath} className="flex items-center gap-2">
              <Logo className="size-7 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                {logoText}
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href || 
                      (pathname.startsWith(item.href) && !['/dashboard', '/dashboard-ba', '/admin'].includes(item.href))
                    }
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
                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" />
                <AvatarFallback>{currentUser ? getInitials(currentUser.nama) : '...'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="font-semibold text-sidebar-foreground">{currentUser?.nama}</span>
                <span className="text-xs text-sidebar-foreground/70">{currentUser?.role}</span>
              </div>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ml-auto">
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex justify-end p-2 md:hidden">
            <SidebarTrigger />
          </div>
           <div className="flex items-center gap-2 p-2 overflow-hidden">
                <SidebarTrigger className="hidden md:flex" />
            </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </DataProvider>
  );
}
