import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { FiMoon, FiSun } from 'solid-icons/fi'
import { Dynamic } from 'solid-js/web';

const ThemeSwitcher: Component = () => {
  const [theme, setTheme] = createSignal('dark');

  const toggleTheme = () => {
    const newTheme = theme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme == "light" ? "retro" : "synthwave");
  };

  return (
    <div class="tooltip tooltip-left" data-tip={`Switch to ${theme() == 'light' ? 'Dark' : 'Light'} theme`}>
      <button onClick={toggleTheme} class="btn btn-ghost">
        <Dynamic component={theme() == 'light' ? FiMoon : FiSun} class="h-5 w-5" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
