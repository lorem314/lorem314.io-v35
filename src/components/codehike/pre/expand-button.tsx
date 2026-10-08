"use client"

import { Button } from "@/components/ui/button"

import { useCodehikePreStore } from "./context"

export const ExpandButton = () => {
  const isCollapsed = useCodehikePreStore((state) => state.isCollapsed)
  const collapseToLine = useCodehikePreStore((state) => state.collapseToLine)
  const lineCount = useCodehikePreStore((state) => state.lineCount)
  const expandCode = useCodehikePreStore((state) => state.expandCode)
  const showExpandButton = useCodehikePreStore(
    (state) => state.showExpandButton,
  )

  if (
    !isCollapsed ||
    collapseToLine === undefined ||
    !showExpandButton ||
    lineCount <= collapseToLine
  ) {
    return null
  }

  return (
    <div className="absolute right-0 bottom-4 left-0 flex justify-center">
      <Button variant="outline" onClick={expandCode}>
        展开剩余 {lineCount - collapseToLine} 行代码
      </Button>
    </div>
  )
}
