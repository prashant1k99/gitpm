import Toast from '@/components/toast';
import type { Component } from 'solid-js';

const Layout: Component<{ children: any }> = (props) => {
  return (
    <div class="min-h-dvh">
      <main class="container mx-auto px-4 py-8">
        {props.children}
      </main>
      <Toast />
    </div>
  );
};

export default Layout;
