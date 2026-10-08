import { createStore } from "zustand/vanilla"

export type CodehikePreState = {
  actionsAnchor: HTMLDivElement | null
  collapseToLine?: number
  lineCount: number
  isCollapsed: boolean
  showExpandButton: boolean
}

export type CodehikePreActions = {
  setActionsAnchor: (anchor: HTMLDivElement | null) => void
  expandCode: () => void
  collapseCode: () => void
}

export type CodehikePreStore = CodehikePreState & CodehikePreActions

export const defaultInitState: CodehikePreState = {
  actionsAnchor: null,
  collapseToLine: undefined,
  lineCount: 0,
  isCollapsed: false,
  showExpandButton: true,
}

export const createCodehikePreStore = (
  initState: CodehikePreState = defaultInitState,
) => {
  return createStore<CodehikePreStore>()((set) => ({
    ...initState,
    setActionsAnchor: (anchor) => {
      set({ actionsAnchor: anchor })
    },
    expandCode: () => {
      set({ isCollapsed: false })
    },
    collapseCode: () => {
      set({ isCollapsed: true })
    },
  }))
}
