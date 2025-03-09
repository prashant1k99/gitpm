import { createStore } from 'solid-js/store'

const [appState, setAppState] = createStore()

export const useAppState = () => [appState, setAppState] as const
