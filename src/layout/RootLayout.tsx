import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { useTheme } from "@/components/theme-provider"
import { Button } from '@/components/ui/button';
import { Moon, SunMedium } from 'lucide-react';

export default function RootLayout({ children }: { children?: ReactNode }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme == "light" ? "dark" : "light")
  }

  return (
    <div className="relative min-h-dvh min-w-dvw overflow-x-hidden bg-muted">
      <Button onClick={toggleTheme} className='absolute top-4 right-4 cursor-pointer' size={'icon'}>
        {theme == "light" ? <Moon className='w-4 h-4' /> : <SunMedium className='w-4 h-4' />}
      </Button>
      {/* Common elements like app-wide notifications could go here */}
      {children || <Outlet />}
    </div>
  );
}
