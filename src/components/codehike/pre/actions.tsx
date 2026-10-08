"use client"

import { cn } from "cn"

import { useCodehikePreStore } from "./context"
import { CopyButton } from "./copy-button"

export const Actions = ({
  textToCopy,
  showCopyButton,
}: {
  textToCopy: string
  showCopyButton?: boolean
}) => {
  const setActionsAnchor = useCodehikePreStore(
    (state) => state.setActionsAnchor,
  )

  return (
    <div
      className={cn(
        "absolute top-0 right-0 bottom-0 h-full rounded-r-lg",
        "px-2.5 pb-2.5",
      )}
    >
      <div
        ref={setActionsAnchor}
        className={cn(
          "sticky top-(--header-height) pt-2.5",
          "flex flex-col gap-2.5",
        )}
      >
        {showCopyButton ? <CopyButton textToCopy={textToCopy} /> : null}
      </div>
    </div>
  )
}
