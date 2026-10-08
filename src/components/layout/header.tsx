"use client"

import Link from "next/link"
import { PanelLeftOpenIcon, PanelLeftCloseIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

import { ThemeToggler } from "./theme-toggler"
import { SearchDialog } from "./search-dialog"

export const Header = ({
  className,
  showLeftDrawerOpener,
  openLeftDrawer,
}: {
  className?: string
  showLeftDrawerOpener: boolean
  openLeftDrawer: () => void
}) => {
  return (
    <header
      className={cn(
        "bg-card/50 flex items-center gap-4 border-b border-dashed px-4",
        "backdrop-blur-xs",
        className,
      )}
    >
      {showLeftDrawerOpener ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" onClick={openLeftDrawer}>
              <PanelLeftOpenIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>打开左侧抽屉</TooltipContent>
        </Tooltip>
      ) : null}

      <div className="mr-auto">
        <Link
          href="/"
          className={cn(
            "text-lg font-bold",
            "text-foreground/90 hover:text-foreground/80",
          )}
        >
          lorem314.io
        </Link>
      </div>

      <div>
        <SearchDialog />
      </div>

      <div>
        <ThemeToggler />
      </div>

      <div id="right-drawer-anchor"></div>
    </header>
  )
}
