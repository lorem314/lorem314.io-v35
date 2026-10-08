import { createStore } from "zustand/vanilla"

import { Theme, PreferredTheme } from "@/types"

type GlobalStoreState = {
  theme: Theme
  preferredTheme: PreferredTheme
}
type GlobalStoreActions = {}
type GlobalStore = GlobalStoreState | GlobalStoreActions

const defaultInitState = {}

export const createGlobalStore = (initState: GlobalStore = defaultInitState) =>
  createStore<GlobalStore>()((set) => ({
    ...initState,
  }))
