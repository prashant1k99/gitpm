import type { Component } from 'solid-js';
import { signOut } from "firebase/auth";
import { auth } from "old-src/src/utils/firebase"
import { useNavigate } from '@solidjs/router';
import ThemeSwitcher from './theme-switcher';

const Header: Component = () => {
  const navigate = useNavigate()
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
    <div class='flex items-center justify-between border-b py-4 px-4'>
      <div>
        Search Bar here
      </div>
      <div class='flex gap-4'>
        <ThemeSwitcher />
        <div class="avatar">
          <div class="w-8 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
