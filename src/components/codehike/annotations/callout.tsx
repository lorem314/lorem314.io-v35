import { cn } from "cn"
import { InlineAnnotation, AnnotationHandler } from "codehike/code"

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch` }}
          className={cn(
            "bg-card border-border my-1 w-fit rounded border px-2",
            "relative whitespace-break-spaces",

            // 不显示行号
            "[pre[data-sln='false']_&]:ml-[-1ch]",
            // 有 mark
            "[pre[data-sln='false'][data-anno-mark='true']_&]:ml-[1ch]",
            // 有 diff
            "[pre[data-sln='false'][data-anno-mark='true'][data-anno-diff='true']_&]:ml-[3ch]",

            // 显示行号
            // line count digits = 1
            "[pre[data-sln='true'][data-lcd='1']_&]:ml-[2ch]",
            // 有 mark
            "[pre[data-sln='true'][data-lcd='1'][data-anno-mark='true']_&]:ml-[4ch]",
            // 有 diff
            "[pre[data-sln='true'][data-lcd='1'][data-anno-mark='true'][data-anno-diff='true']_&]:ml-[6ch]",
            // line count digits = 2
            "[pre[data-sln='true'][data-lcd='2']_&]:ml-[3ch]",
            "[pre[data-sln='true'][data-lcd='2'][data-anno-mark='true']_&]:ml-[5ch]",
            "[pre[data-sln='true'][data-lcd='2'][data-anno-mark='true'][data-anno-diff='true']_&]:ml-[7ch]",
            // line count digits = 3
            "[pre[data-sln='true'][data-lcd='3']_&]:ml-[4ch]",
            "[pre[data-sln='true'][data-lcd='3'][data-anno-mark='true']_&]:ml-[6ch]",
            "[pre[data-sln='true'][data-lcd='3'][data-anno-mark='true'][data-anno-diff='true']_&]:ml-[8ch]",
          )}
        >
          <div
            style={{ left: `${column}ch` }}
            className={cn(
              "bg-card border-border h-2 w-2 border-t border-l",
              "absolute -top-px -translate-y-1/2 rotate-45",
            )}
          />
          {annotation.query}
        </div>
      </>
    )
  },
}
