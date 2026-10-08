import Link from "next/link"

import { ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ExternalLinkProps = React.ComponentProps<"a"> & {
  iconSize?: string | number | undefined
}

export const ExternalLink = ({
  className,
  href,
  target,
  rel,
  children,
  iconSize = 16,
  ...restProps
}: ExternalLinkProps) => {
  return (
    <Link
      {...restProps}
      className={cn(
        "inline-flex items-center gap-0.5",
        "text-link-foreground",
        "no-underline hover:underline",
        className,
      )}
      href={href || ""}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLinkIcon size={iconSize || 16} />
    </Link>
  )
}
