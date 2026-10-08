"use client"

import { cn } from "cn"

import { Button } from "@/components/ui/button"

import { ExpandButton } from "./expand-button"
import { Actions } from "./actions"

import { useCodehikePreStore } from "./context"

export const Client = ({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) => {
  const collapseToLine = useCodehikePreStore((state) => state.collapseToLine)
  const isCollapsed = useCodehikePreStore((state) => state.isCollapsed)
  const showExpandButton = useCodehikePreStore(
    (state) => state.showExpandButton,
  )

  // const maxH = collapseToLine ? `max-h-${(collapseToLine * 24) / 4}` : ""

  return (
    <div
      className={cn(
        className,
        // isCollapsed && !showExpandButton ? "overflow-y-hidden" : "",
        showExpandButton && isCollapsed ? "overflow-y-hidden" : "",
      )}
      style={{
        ...style,
        maxHeight:
          isCollapsed && collapseToLine
            ? `${collapseToLine * 24 + 12}px`
            : undefined,
        // maxHeight: "0",
      }}
    >
      {children}
    </div>
  )
}
