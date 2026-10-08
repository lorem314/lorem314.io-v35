import NextLink from "next/link"

import { ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type LinkProps = React.ComponentProps<"a"> & {
  iconSize?: string | number | undefined
}

export const Link = ({
  className,
  href,
  children,
  iconSize,
  ...restProps
}: LinkProps) => {
  if (href?.startsWith("http") || href?.startsWith("localhost")) {
    return (
      <a
        className={cn(
          "inline-flex items-center-safe gap-0.5",
          "text-link-foreground no-underline hover:underline",
          className,
        )}
        href={href || ""}
        {...restProps}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
        <ExternalLinkIcon size={iconSize || 16} />
      </a>
    )
  }

  return (
    <NextLink
      className={cn(
        "text-link-foreground no-underline hover:underline",
        className,
      )}
      href={href || ""}
      {...restProps}
    >
      {children}
    </NextLink>
  )
}
