"use client"

import { type ReactNode, createContext, useState, useContext } from "react"
import { useStore } from "zustand"

import {
  createCodehikePreStore,
  type CodehikePreStore,
  defaultInitState,
} from "./store"

export type CodehikePreStoreApi = ReturnType<typeof createCodehikePreStore>

export const CodehikePreStoreContext = createContext<
  CodehikePreStoreApi | undefined
>(undefined)

export interface CodehikePreStoreProviderProps {
  children: ReactNode
  collapseToLine?: number
  lineCount: number
  showExpandButton?: boolean
}

export const CodehikePreStoreProvider = ({
  children,
  collapseToLine,
  lineCount,
  showExpandButton = true,
}: CodehikePreStoreProviderProps) => {
  const [store] = useState(() =>
    createCodehikePreStore({
      ...defaultInitState,
      collapseToLine,
      lineCount,
      isCollapsed: collapseToLine ? true : false,
      showExpandButton,
    }),
  )

  return (
    <CodehikePreStoreContext.Provider value={store}>
      {children}
    </CodehikePreStoreContext.Provider>
  )
}

export const useCodehikePreStore = <T,>(
  selector: (store: CodehikePreStore) => T,
): T => {
  const storeContext = useContext(CodehikePreStoreContext)

  if (!storeContext) {
    throw new Error(`useCodehikePreStore must be used within StoreProvider`)
  }

  return useStore(storeContext, selector)
}
