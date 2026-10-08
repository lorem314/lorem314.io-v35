import fs from "fs/promises"
import path from "path"

import { CodeHikePre, type CodeHikePreProps } from "../pre"
import { Prettify } from "@/types"
import { cn } from "cn"

type CodeViewerProps = Prettify<
  { file: string } & Omit<CodeHikePreProps, "codeblock">
>

export async function CodeViewer({ file, className }: CodeViewerProps) {
  const filePath = path.join(process.cwd(), file)
  const value = await fs.readFile(filePath, "utf-8")
  const lang = (path.extname(file) || "txt").slice(1)

  // const rawMeta = cn(
  //   title ? `title="${title}"` : "",
  //   showLineNumbers ? "showLineNumbers" : "",
  //   showCopyButton ? "showCopyButton" : "",
  //   handlers ? `handlers="${handlers}"` : "",
  //   theme ? `theme="${theme}"` : "",
  // )

  return (
    <CodeHikePre
      className={cn("", className)}
      codeblock={{ lang, meta: "", value: value.trim() }}
    />
  )
}
