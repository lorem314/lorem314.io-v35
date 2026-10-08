import fs from "node:fs/promises"
import path from "node:path"

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProviderProps,
} from "@codesandbox/sandpack-react"
import { cn } from "cn"

import { Client } from "./client"
import { Title } from "./title"
import { FileTabs } from "./file-tabs"

const CWD = process.cwd()

export type CodeSandboxProps = {
  folder?: string
  files: Record<string, boolean | string>
  title?: string
  readOnly?: boolean
  previewHeight?: string

  template?: SandpackProviderProps["template"]
  options?: SandpackProviderProps["options"]
  customSetup?: SandpackProviderProps["customSetup"]

  // code hike pre props
  collapseToLine?: number
  showExpandButton?: boolean
}

export async function CodeSandbox({
  folder = "",
  files,
  title,
  readOnly = true,
  previewHeight = "300px",

  template,
  options,
  customSetup,

  collapseToLine,
  showExpandButton,
}: CodeSandboxProps) {
  const sandpackFiles: Record<string, string> = await Promise.all(
    Object.entries(files).map(async ([filePath, value]) => {
      const content =
        typeof value === "string"
          ? await fs.readFile(path.join(CWD, folder, value), "utf-8")
          : value
            ? await fs.readFile(path.join(CWD, folder, filePath), "utf-8")
            : ""
      return { content, path: filePath }
    }),
  ).then((files) => {
    return files
      .filter((file) => (file.content ? true : false))
      .reduce(
        (files, { path, content }) => ({ ...files, [path]: content.trim() }),
        {},
      )
  })

  return (
    <Client
      files={sandpackFiles}
      template={template}
      options={options}
      customSetup={customSetup}
    >
      <SandpackLayout
        className={cn(
          "bg-card! text-foreground! block! rounded-lg!",
          "border-border! border-px box-border! text-base!",
          "overflow-visible!",
          // readOnly ? "overflow-visible!" : "overflow-visible!",
        )}
      >
        <Title title={title} />

        <SandpackPreview
          style={{ height: previewHeight }}
          showRefreshButton={false}
          showOpenInCodeSandbox={false}
        />

        <FileTabs
          readOnly={readOnly}
          sandpackFiles={sandpackFiles}
          options={options}
          collapseToLine={collapseToLine}
          showExpandButton={showExpandButton}
        />
      </SandpackLayout>
    </Client>
  )
}
