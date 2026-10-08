import {
  SandpackProviderProps,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CodeHikePre } from "@/components/codehike/pre"

export const FileTabs = ({
  readOnly,
  sandpackFiles,
  options,
  collapseToLine,
  showExpandButton,
}: {
  readOnly: boolean
  sandpackFiles: Record<string, string>
  options: SandpackProviderProps["options"]
  // code hike pre props
  collapseToLine?: number
  showExpandButton?: boolean
}) => {
  const firstFileName = sandpackFiles[Object.keys(sandpackFiles)[0]]

  return (
    <div className="border-t">
      {readOnly ? (
        <Tabs defaultValue={options?.activeFile || firstFileName}>
          <TabsList variant="line" className="p-0.5">
            {Object.keys(sandpackFiles).map((fileName) => {
              if (
                options?.visibleFiles &&
                !options?.visibleFiles.includes(fileName)
              ) {
                return null
              }
              const splitted = fileName.split("/")

              return (
                <TabsTrigger key={fileName} value={fileName}>
                  {splitted.at(-1)}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(sandpackFiles).map(([fileName, fileContent]) => {
            if (
              options?.visibleFiles &&
              !options?.visibleFiles.includes(fileName)
            ) {
              return null
            }
            const lang = fileName.split(".").at(-1) || "txt"

            return (
              <TabsContent
                className="rounded-b-lg"
                key={fileName}
                value={fileName}
              >
                <CodeHikePre
                  className="my-0! border-none"
                  codeblock={{
                    value: fileContent,
                    lang,
                    meta: "shouLineNumbers",
                  }}
                  showLineNumbers
                  collapseToLine={collapseToLine}
                  showExpandButton={showExpandButton}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      ) : (
        <div className="overflow-hidden rounded-b-lg">
          <SandpackCodeEditor
            className="font-mono text-sm"
            // showTabs={false}
            showLineNumbers
          />
        </div>
      )}
    </div>
  )
}
