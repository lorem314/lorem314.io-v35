import { AnnotationHandler, InnerLine, BlockAnnotation } from "codehike/code"

import { cn } from "@/lib/utils"

export const diff: AnnotationHandler = {
  name: "diff",
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query == "-" ? "#f85149" : "#3fb950"
    return [annotation, { ...annotation, name: "mark", query: color }]
  },
  Line: ({ annotation, ...props }) => (
    <div
      className="flex"
      style={{
        userSelect: annotation?.query == "-" ? "none" : "auto",
      }}
    >
      <div style={{}} />
      <div
        className={cn(
          "box-content min-w-[1ch] px-1",
          annotation?.query === "+"
            ? "text-green-700/60 dark:text-green-400/60"
            : "text-red-700/60 dark:text-red-400/60",
        )}
      >
        {annotation?.query}
      </div>
      <InnerLine merge={props} />
    </div>
  ),
}
