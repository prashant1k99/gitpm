import { effect, signal, untracked } from "@preact/signals-react"
import orgState from "./organizations"

export interface IViewState {
  orgLogin: string
  activeViewId: number | null
  selectedIds: string[]
}

const viewState = signal<IViewState>({
  orgLogin: "",
  activeViewId: null,
  selectedIds: []
})

effect(() => {
  if (orgState.value.activeOrg && orgState.value.activeOrg?.login != viewState.peek().orgLogin) {
    untracked(() => {
      viewState.value = {
        orgLogin: orgState.value.activeOrg?.login as string,
        activeViewId: null,
        selectedIds: []
      }
    })
  }
})

export default viewState
