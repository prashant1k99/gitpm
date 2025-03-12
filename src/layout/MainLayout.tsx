import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from '@/components/ui/separator';
import { NavThemeSwitcher } from '@/components/nav/nave-theme-switcher';

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b ">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className='flex items-center gap-2'>
              <img className="inline-block size-8 rounded-md" src="src/assets/logo.png" alt="" />
              <SidebarTrigger className='xl:hidden' />
            </div>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <NavThemeSwitcher />
          </div>
        </header>
        <main className='p-4'>
          {children || <Outlet />}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
