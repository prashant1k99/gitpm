import { Outlet, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function MainLayout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();

  const signOutUser = () => {
    signOut(auth).then(() => {
      navigate("/login")
      // Sign-out successful.
    }).catch((error) => {
      console.error(error)
      // An error happened.
    });
  }

  return (
    <div className="min-h-dvh min-w-dvw overflow-x-hidden">
      <Button onClick={signOutUser}>Logout</Button>
      {/* Common elements like app-wide notifications could go here */}
      <div className=''>
        {children || <Outlet />}
      </div>
    </div>
  );
}
