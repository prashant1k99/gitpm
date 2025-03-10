import ThemeSwitcher from '@/components/theme-switcher';
import Toast from '@/components/toast';
import type { Component } from 'solid-js';

const FullScreenLayout: Component<{ children: any }> = (props) => {
  return (
    <div class='relative min-h-dvh h-full w-full'>
      <div class='absolute top-4 right-4'>
        <ThemeSwitcher />
      </div>
      {props.children}
      <Toast />
    </div>
  );
};

export default FullScreenLayout;
