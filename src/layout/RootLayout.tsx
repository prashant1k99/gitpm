import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-dvh min-w-dvw overflow-x-hidden">
      {/* Common elements like app-wide notifications could go here */}
      {children || <Outlet />}
    </div>
  );
}
