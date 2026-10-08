"use client"

import React from "react"
import { CopyCheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

export const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const handleClick = React.useCallback(() => {
    try {
      navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setIsOpen(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 1500)
    } catch (error) {}
  }, [textToCopy])

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm" onClick={handleClick}>
          {isCopied ? (
            <CopyCheckIcon className="text-green-600 dark:text-green-400" />
          ) : (
            <CopyIcon />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        {isCopied ? "已复制" : "复制代码"}
      </TooltipContent>
    </Tooltip>
  )
}
