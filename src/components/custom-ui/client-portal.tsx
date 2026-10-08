"use client"

import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

import { useIsMounted } from "@/hooks/use-mounted"

type ClientPortalProps = {
  children: ReactNode
  targetId?: string
}

export function ClientPortal({ children, targetId }: ClientPortalProps) {
  const isMounted = useIsMounted()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current = targetId
      ? document.getElementById(targetId) || document.body
      : document.body
  }, [])

  if (!isMounted || !ref.current || typeof document === "undefined") {
    return <div style={{ display: "none" }}>{children}</div>
  }

  return createPortal(children, ref.current)
}
