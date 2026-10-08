import { LinkIcon, Link2Icon } from "lucide-react"
import { cn } from "cn"

export const H1 = ({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h1">) => {
  return (
    <h1 {...restProps} className={cn("text-4xl font-bold", className)}>
      {children}
    </h1>
  )
}

const headingClassName = cn(
  "scroll-m-[calc(var(--header-height)+1rem)]",
  "font-bold flex relative group first:mt-0",
)

const HeadingLink = ({
  id,
  children,
}: {
  id?: string
  children: React.ReactNode
}) => {
  return (
    <a href={`#${id}`} className="font-bold no-underline">
      {children}
    </a>
  )
}

export const H2 = ({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h2">) => {
  return (
    <h2 {...restProps} className={cn(headingClassName, "text-3xl", className)}>
      <HeadingLink id={restProps.id}>{children}</HeadingLink>
    </h2>
  )
}

export const H3 = ({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h3">) => {
  return (
    <h3 {...restProps} className={cn(headingClassName, "text-2xl", className)}>
      <HeadingLink id={restProps.id}>{children}</HeadingLink>
    </h3>
  )
}

export const H4 = ({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h4">) => {
  return (
    <h4 {...restProps} className={cn(headingClassName, "text-xl", className)}>
      <HeadingLink id={restProps.id}>{children}</HeadingLink>
    </h4>
  )
}

export const H5 = ({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h5">) => {
  return (
    <h5 {...restProps} className={cn(headingClassName, "text-lg", className)}>
      <HeadingLink id={restProps.id}>{children}</HeadingLink>
    </h5>
  )
}

export const H6 = ({
  className,
  children,
  ...restProps
}: React.ComponentProps<"h6">) => {
  return (
    <h6 {...restProps} className={cn(headingClassName, "text-base", className)}>
      <HeadingLink id={restProps.id}>{children}</HeadingLink>
    </h6>
  )
}

export const BlockQuote = ({
  className,
  ...restProps
}: React.ComponentProps<"blockquote">) => {
  return (
    <blockquote
      className={cn("not-prose border-l-muted border-l-4 pl-4", className)}
      {...restProps}
    />
  )
}

export const InlineCode = ({
  className,
  ...restProps
}: React.ComponentProps<"code">) => {
  return (
    <code
      className={cn(
        "font-mono font-medium",
        "before:content-[''] after:content-['']",
        "bg-muted text-accent-foreground rounded px-1 py-0.5",
        "border-muted-foreground/10 border",
        className,
      )}
      {...restProps}
    />
  )
}
