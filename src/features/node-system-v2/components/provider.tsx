"use client"

import { type ReactNode, createContext, useState, useContext } from "react"
import { useStore } from "zustand"

import { type NodeSystemStore, createNodeSystemStore } from "../stores"

export type NodeSystemApi = ReturnType<typeof createNodeSystemStore>

export const NodeSystemStoreContext = createContext<NodeSystemApi | undefined>(
  undefined,
)

export type NodeSystemStoreProviderProps = Readonly<{
  children: ReactNode
}>

export const NodeSystemStoreProvider = ({
  children,
}: NodeSystemStoreProviderProps) => {
  const [store] = useState(() => createNodeSystemStore())

  return (
    <NodeSystemStoreContext.Provider value={store}>
      {children}
    </NodeSystemStoreContext.Provider>
  )
}

export const useNodeSystemStore = <T,>(
  selector: (store: NodeSystemStore) => T,
): T => {
  const context = useContext(NodeSystemStoreContext)

  if (!context) {
    throw new Error(`useNodeSystemStore must be used within NodeSystemProvider`)
  }

  return useStore(context, selector)
}
