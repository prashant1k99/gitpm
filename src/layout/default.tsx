import Toast from '@/components/toast';
import type { Component } from 'solid-js';
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase"
import { useNavigate } from '@solidjs/router';

const Layout: Component<{ children: any }> = (props) => {
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
    <div class="min-h-dvh min-w-dvw flex flex-row">
      <aside class="w-80 bg-base-200 border-r border-base-300 p-8 flex flex-col gap-4">
        <div class="flex items-center gap-2 px-2">
          <img src="/src/assets/logo.png" alt="GitPM Logo" class="w-8 h-8" />
          <h1 class="text-xl font-bold">GitPM</h1>
        </div>
        <select class="select select-accent">
          <option disabled selected>Pick a font</option>
          <option>Inter</option>
          <option>Poppins</option>
          <option>Raleway</option>
        </select>
        <nav class="flex flex-col gap-2">
          <a href="/" class="btn btn-ghost justify-start">Dashboard</a>
          <a href="/projects" class="btn btn-ghost justify-start">Projects</a>
          <a href="/tasks" class="btn btn-ghost justify-start">Tasks</a>
        </nav>
        <button onClick={signOutUser} class="btn btn-error">Sign Out</button>
      </aside>
      <main class="flex-1 container mx-auto px-4 py-8">
        {props.children}
      </main>
      <Toast />
    </div>
  );
};

export default Layout;
