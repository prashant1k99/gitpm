import { createStore } from 'solid-js/store'

export enum ToastType {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
  PRIMARY = "primary"
}

interface ToastContents {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
}

type ToastState = ToastContents[]

const [toasts, setToasts] = createStore<ToastState>([])

const generateId = () => Math.random().toString(36).substr(2, 9)

const addToast = (message: string, type?: ToastType) => {
  const id = generateId()

  setToasts(prev => [...prev, {
    id,
    message,
    type: type || ToastType.INFO,
    isVisible: true
  }])

  // Set timeout to hide this specific toast
  setTimeout(() => {
    setToasts(t => t.map(toast =>
      toast.id === id
        ? { ...toast, isVisible: false }
        : toast
    ))

    // Remove the toast after animation (assuming 300ms fade out)
    setTimeout(() => {
      setToasts(t => t.filter(toast => toast.id !== id))
    }, 300)
  }, 5000)
}

export const useToasts = () => [toasts, { addToast }] as const
