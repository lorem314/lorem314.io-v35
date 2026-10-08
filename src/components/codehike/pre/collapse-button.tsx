"use client"

import { createPortal } from "react-dom"
import { ChevronsDownUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

import { useCodehikePreStore } from "./context"

export const CollapseButton = () => {
  const actionsAnchor = useCodehikePreStore((state) => state.actionsAnchor)
  const isCollapsed = useCodehikePreStore((state) => state.isCollapsed)
  const collapseCode = useCodehikePreStore((state) => state.collapseCode)
  const showExpandButton = useCodehikePreStore(
    (state) => state.showExpandButton,
  )

  if (
    !actionsAnchor ||
    !showExpandButton ||
    (showExpandButton && isCollapsed)
  ) {
    return null
  }

  return createPortal(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={collapseCode}>
          <ChevronsDownUpIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        折叠代码
      </TooltipContent>
    </Tooltip>,
    actionsAnchor,
  )
}
