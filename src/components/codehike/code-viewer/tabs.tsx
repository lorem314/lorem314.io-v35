import fs from "node:fs/promises"
import path from "node:path"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeHikePre } from "../pre"

// 用在 React 组件中
export async function CodeViewerTabs({
  folder,
  files,
}: {
  folder?: string
  files: { path: string; title?: string; meta?: string }[]
}) {
  const tabs = await Promise.all(
    files.map(async (file, index) => {
      const fileContent = await fs.readFile(
        path.join(process.cwd(), folder || "", file.path),
        "utf-8",
      )

      const fileName = file.path.split("/").at(-1)
      const [title, lang] = fileName
        ? fileName.split(".")
        : [`文件 ${index}`, "txt"]

      return {
        title: file.title || title || `文件 ${index}`,
        // path: file.path,
        value: fileContent.trim(),
        lang: lang || "txt",
        meta: file.meta || "",
      }
    }),
  )

  return (
    <div data-slot="code-viewer-with-tabs">
      <Tabs defaultValue={tabs[0]?.meta}>
        <TabsList variant="line">
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={`${tab.title}-${index}`}
              value={`${tab.title}-${index}`}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, index) => {
          return (
            <TabsContent
              key={`${tab.title}-${index}`}
              value={`${tab.title}-${index}`}
            >
              <CodeHikePre className="my-0!" codeblock={tab} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
