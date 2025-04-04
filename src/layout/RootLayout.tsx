import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { useTheme } from "@/components/theme-provider"
import { Button } from '@/components/ui/button';
import { Moon, SunMedium } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }: { children?: ReactNode }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme == "light" ? "dark" : "light")
  }

  return (
    <div className="relative min-h-dvh min-w-dvw overflow-x-hidden bg-muted">
      <div className='absolute top-4 right-4 flex justify-center gap-4'>
        <Button variant={"outline"} size={"icon"} onClick={toggleTheme}>
          {theme == "light" ? <Moon className='w-4 h-4' /> : <SunMedium className='w-4 h-4' />}
        </Button>
      </div>
      {/* Common elements like app-wide notifications could go here */}
      {children || <Outlet />}
      <Toaster />
    </div>
  );
}
