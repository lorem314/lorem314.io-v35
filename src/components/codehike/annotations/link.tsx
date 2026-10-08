import type { AnnotationHandler } from "codehike/code"

import { Link } from "@/components/custom-ui/link"

export const link: AnnotationHandler = {
  name: "link",
  Inline: ({ annotation, children }) => {
    const { query } = annotation
    return (
      <Link href={query} iconSize={12} className="items-start">
        {children}
      </Link>
    )
  },
}
