import { AnnotationHandler, InnerLine } from "codehike/code"
import { cn } from "cn"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 2

    return (
      <div className="flex items-center">
        <span
          className={cn(
            "text-right select-none",
            "text-muted-foreground/60",
            "pr-[2ch]",
          )}
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1" />
      </div>
    )
  },
}
