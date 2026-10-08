"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export const Details = React.forwardRef(
  (props: React.ComponentProps<"details">, ref) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(props.open ?? true)

    const childArray = React.Children.toArray(props.children)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    React.useImperativeHandle(ref, () => ({ open, close }), [open, close])

    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      isOpen ? close() : open()
    }

    const Icon = isOpen ? ChevronDown : ChevronRight

    return (
      <details className="group/details" open={isOpen}>
        <summary
          className={cn(
            "group/summary flex cursor-pointer rounded",
            "hover:bg-accent/50",
          )}
          onClick={handleClick}
        >
          <Icon
            size={28}
            className={cn(
              "shrink-0 p-1",
              "text-muted-foreground hover:text-foreground",
            )}
          />
          {childArray[0]}
        </summary>

        {childArray[1]}
      </details>
    )
  },
)
