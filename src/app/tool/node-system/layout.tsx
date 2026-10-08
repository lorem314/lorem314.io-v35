import { ReactNode } from "react"

import { NodeSystemStoreProvider } from "@/features/node-system-v2/components/provider"

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <NodeSystemStoreProvider>{children}</NodeSystemStoreProvider>
}
