import { cn } from "cn"

export const Title = ({
  className,
  style,
  title,
}: {
  className?: string
  style?: React.CSSProperties
  title: string
}) => {
  if (!title) return null

  return (
    <figcaption
      className={cn("mt-0 border-b border-dashed px-4 py-2.5", className)}
      style={style}
    >
      {title}
    </figcaption>
  )
}
