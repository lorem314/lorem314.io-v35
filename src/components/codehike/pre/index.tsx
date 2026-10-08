import {
  InnerLine,
  Pre,
  highlight,
  type HighlightedCode,
  type AnnotationHandler,
  type RawCode,
  InlineAnnotation,
  BlockAnnotation,
} from "codehike/code"
import { cn } from "cn"

import { CodehikePreStoreProvider } from "./context"
import { Title } from "./title"
import { Actions } from "./actions"
import { ExpandButton } from "./expand-button"
import { CollapseButton } from "./collapse-button"
import { Client } from "./client"

import { callout } from "../annotations/callout"
import { className } from "../annotations/classname"
import { diff } from "../annotations/diff"
import { mark } from "../annotations/mark"
import { lineNumbers } from "../annotations/line-numbers"
import { link } from "../annotations/link"

import type { CodeHikeTheme } from "@/types"

const line: AnnotationHandler = {
  name: "line",
  Line: (props) => {
    // const showLineNumbers = props.data?.showLineNumbers || false
    // props.data 外部传来的 data 只能由 Block 接收 ？！这里是 Line
    // console.log("wtf", props.data?.wtf)
    return (
      <InnerLine merge={props} className={cn("pr-13")} data-annotation="line" />
    )
  },
}

const handlerMap: { [key: string]: AnnotationHandler[] } = {
  callout: [callout],
  mark: [mark],
  diff: [diff],
  link: [link],
  className: [className],
  // fold: [fold],
  // hover: [hover],
  // collapse: [collapse, collapseTrigger, collapseContent],
  // tokenTransitions: [tokenTransitions],
  // focus: [focus],
}

/**
 * 用 `collapseToLine` 和 `showExpandButton` 组合出不同功能的代码块:
 *
 * - 可展开代码块 (expandable codeblock)
 * ```ts
 * collapseToLine: number; showExpandButton: true
 * ```
 *
 * - 全高代码块 (full height codeblock)
 * ```ts
 * collapseToLine: undefined; showExpandButton: false
 * ```
 *
 * - 固定高度代码块 (fixed height codeblock)
 * ```ts
 * collapseToLine: number; showExpandButton: false
 * ```
 *
 */
export type CodeHikePreProps = {
  codeblock: RawCode
  className?: string
  title?: string
  collapseToLine?: number
  showExpandButton?: boolean
  showLineNumbers?: boolean
  showCopyButton?: boolean
  theme?: CodeHikeTheme
}

export async function CodeHikePre(props: CodeHikePreProps) {
  const { className, codeblock } = props

  const highlighted = await highlight(
    codeblock,
    props.theme || "github-from-css",
  )
  const parsedMeta = parseMeta(codeblock.meta)

  const handlers: AnnotationHandler[] = [line]

  if (props.showLineNumbers ?? parsedMeta.showLineNumbers) {
    handlers.push(lineNumbers)
  }

  const usedHandlerNames = parsedMeta.handlers.split(" ")
  usedHandlerNames.forEach((handlerName) => {
    if (!handlerName) return
    const handler = handlerMap[handlerName] as AnnotationHandler[] | undefined
    if (handler) handlers.push(...handler)
  })

  const lineCount = highlighted.code.split(/\r\n|\n|\r/).length
  const lineCountDigits = lineCount.toString().length

  const title = props.title ?? parsedMeta.title
  const collapseToLine = props.collapseToLine ?? parsedMeta.collapseToLine
  const showExpandButton = props.showExpandButton ?? parsedMeta.showExpandButton
  const showCopyButton = props.showCopyButton ?? parsedMeta.showCopyButton
  const showLineNumbers = props.showLineNumbers ?? parsedMeta.showLineNumbers

  let textToCopy = ""
  if (showCopyButton) {
    textToCopy = getCopyableCode(highlighted)
  }

  return (
    <CodehikePreStoreProvider
      collapseToLine={collapseToLine}
      lineCount={lineCount}
      showExpandButton={showExpandButton}
    >
      {/* <pre>{JSON.stringify({}, undefined, 2)}</pre> */}
      <figure className={cn("rounded-lg border", className)}>
        <Title
          className="rounded-t-lg"
          style={{
            color: highlighted.style.color,
            background: highlighted.style.background,
          }}
          title={title}
        />

        <div
          className={cn(
            "relative rounded-b-lg",
            title ? "rounded-t-none" : "rounded-t-lg",
          )}
          style={highlighted.style}
        >
          <Client
            className={cn("no-scrollbar scroll-fade overflow-auto rounded-lg")}
            style={{
              backgroundColor: highlighted.style.backgroundColor,
            }}
          >
            <Pre
              className={cn(
                "not-prose rounded-b-lg py-3 text-sm leading-6",
                "pl-4",

                "data-[sln=false]:data-[anno-mark=true]:pl-0",
                // showLineNumbers ? "pl-4" : "pl-0",

                // handlers.includes(mark) ? "px-0" : "px-4",
                ["markdown", "mdx", "md"].includes(highlighted.lang)
                  ? "font-maple"
                  : "font-fira",
              )}
              code={highlighted}
              handlers={handlers}
              data-sln={handlers.includes(lineNumbers)}
              data-lcd={lineCountDigits}
              data-anno-mark={handlers.includes(mark)}
              data-anno-diff={handlers.includes(diff)}
            />
          </Client>

          <ExpandButton />
          <CollapseButton />
          <Actions textToCopy={textToCopy} showCopyButton={showCopyButton} />
        </div>
      </figure>
    </CodehikePreStoreProvider>
  )
}

type DefaultMeta = {
  title: string
  showLineNumbers: boolean
  showCopyButton: boolean
  theme: string
  handlers: string
  collapseToLine: number | undefined
  showExpandButton: boolean | undefined
}

const defaultMeta: DefaultMeta = {
  title: "",
  showLineNumbers: false,
  showCopyButton: false,
  theme: "github-from-css" as const,
  handlers: "",
  collapseToLine: undefined,
  showExpandButton: false,
}

export const parseMeta = (rawMeta: string) => {
  if (!rawMeta) return defaultMeta

  const iterator = rawMeta.matchAll(
    /(?<key>[\w-]+)(?:=(?:"(?<strVal>[^"]*)"|(?<numVal>\d+)))?/g,
  )
  const meta: Record<string, number | string | boolean> = {}

  for (const match of iterator) {
    const { key, strVal, numVal } = match.groups || {}

    if (!(key in defaultMeta)) continue

    if (strVal !== undefined) meta[key] = strVal
    else if (numVal !== undefined) meta[key] = numVal
    else meta[key] = true
  }

  return { ...defaultMeta, ...meta }
}

function getCopyableCode(highlighted: HighlightedCode): string {
  const lines = highlighted.code.split("\n")
  const exclude = new Set<number>()

  for (const annotation of highlighted.annotations) {
    if (annotation.name === "diff" && annotation.query === "-") {
      const fromLineNumber = (annotation as BlockAnnotation).fromLineNumber
      const toLineNumber = (annotation as BlockAnnotation).toLineNumber
      if (fromLineNumber === toLineNumber) {
        exclude.add(fromLineNumber)
      }
    }

    // 如果以后有其他不想复制的 annotation，可以在这里继续加
    // if (ann.name === "callout") { ... }
  }

  return lines
    .filter((_, idx) => !exclude.has(idx + 1)) // 行号从 1 开始
    .join("\n")
}
