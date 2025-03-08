import Header from '@/components/header';
import { useAppState } from '@/state/auth';
import type { Component } from 'solid-js';

const HomePage: Component = () => {
  const [appState, _] = useAppState();

  return (
    <div>
      <Header />
      <h1 class="text-3xl font-bold underline">
        {JSON.stringify(appState.user, null, 2) || "Not found"}
      </h1>
    </div>
  );
};

export default HomePage;
