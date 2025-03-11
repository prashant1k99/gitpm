import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children || <Outlet />}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
