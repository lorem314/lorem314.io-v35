"use client"

import React from "react"
import { ListTreeIcon } from "lucide-react"
import type { TableOfContents } from "fumadocs-core/toc"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { Actions } from "./actions"
import { Toc } from "./toc"
import { ClientPortal } from "@/components/custom-ui/client-portal"
import { Drawer, useDrawer } from "@/components/custom-ui/drawer"
// import { throttle } from "@/lib/utils"
import { throttle } from "@/lib/helper"

export const Layout = ({
  children,
  title,
  toc,
}: {
  children: React.ReactNode
  title: string
  toc: TableOfContents
}) => {
  const isRightDrawerAlwaysCollapsed = false

  const refTocWrapper = React.useRef<HTMLDivElement>(null)

  const {
    isCollapsed: isRightDrawerCollapsed,
    isOpen: isRightDrawerOpen,
    handler: rightDrawerHandler,
  } = useDrawer({
    isAlwaysCollapsed: isRightDrawerAlwaysCollapsed,
    mediaQuery: "(max-width: 1279px)",
  })

  React.useEffect(() => {
    const node = refTocWrapper.current
    if (!node || isRightDrawerAlwaysCollapsed) return

    const rect = node.getBoundingClientRect()
    node.style.height = `${window.innerHeight - rect.top - 10}px`

    const handleScroll = throttle(() => {
      if (!refTocWrapper.current) return
      const rect = node.getBoundingClientRect()
      if (rect.top > 80) {
        const height = window.innerHeight - rect.top - 16
        node.style.height = `${height}px`
      }
    }, 256)

    const handleResize = throttle(() => {
      if (!refTocWrapper.current) return
      const rect = node.getBoundingClientRect()
      const height = window.innerHeight - rect.top - 16
      node.style.height = `${height}px`
    }, 256)

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [isRightDrawerAlwaysCollapsed])

  const showRightDrawerOpener =
    isRightDrawerAlwaysCollapsed || isRightDrawerCollapsed

  return (
    <div
      className={cn(
        "relative mx-auto flex flex-col-reverse gap-6",
        "md:grid md:max-w-3xl md:grid-cols-[40px_minmax(60ch,1fr)]",
        "xl:max-w-screen-2xl xl:grid-cols-[40px_minmax(60ch,1fr)_450px]",
      )}
    >
      <Actions />

      <article
        className={cn(
          "shrink-0 grow py-4",
          showRightDrawerOpener ? "grow-0" : "",
        )}
      >
        {children}
      </article>

      {showRightDrawerOpener ? (
        <>
          <ClientPortal targetId="right-drawer-anchor">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={rightDrawerHandler.open}
                >
                  <ListTreeIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>打开目录</TooltipContent>
            </Tooltip>
          </ClientPortal>
          <Drawer
            isOpen={isRightDrawerOpen}
            onClose={rightDrawerHandler.close}
            title="目录"
            side="right"
            size="420px"
          >
            {() => {
              return <Toc title={title} toc={toc} />
            }}
          </Drawer>
        </>
      ) : (
        <div className="hidden xl:block xl:shrink-0 xl:grow-2">
          <div
            className={cn(
              "sticky top-20 max-h-fit min-h-9.5 transition-[height]",
              "bg-card/50 overflow-y-hidden rounded-lg border border-dashed",
              // "max-h-[calc(100dvh-64px-16px-16px)]",
            )}
          >
            <div
              ref={refTocWrapper}
              className="scroll-fade-y no-scrollbar max-h-[inherit] overflow-y-auto"
            >
              <Toc title={title} toc={toc} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
