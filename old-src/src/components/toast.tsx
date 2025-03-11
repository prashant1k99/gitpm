import { useToasts } from 'old-src/src/state/toast';
import { For, type Component } from 'solid-js';

const Toast: Component = () => {
  const [toasts] = useToasts();

  return (
    <div class="toast">
      <For each={toasts}>
        {(toast) => (
          <div class={`alert alert-${toast.type} transform transition-all duration-300 ${toast.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}>
            <span>{toast.message}</span>
          </div>
        )}
      </For>
    </div>
  )
}

export default Toast
