import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { z } from "zod"
import type { RawCode } from "codehike/code"

import { TabsContent } from "@/components/ui/tabs"
import { CodeHikePre } from "../pre"
import { NpmTabsClient } from "./client"

const Schema = Block.extend({
  tabs: z.array(CodeBlock),
  showLineNumbers: z.boolean().optional().default(false),
  showCopyButton: z.boolean().optional().default(false),
  syncTabs: z.boolean().default(true),
})

export async function NpmTabs(props: any) {
  const { tabs } = parseProps(props, Schema) as { tabs: RawCode[] }

  return (
    <NpmTabsClient tabs={tabs.map((tab) => ({ title: tab.meta }))}>
      {tabs.map((tab) => {
        return (
          <TabsContent key={tab.meta} value={tab.meta}>
            <CodeHikePre
              className="my-0!"
              codeblock={{
                value: tab.value,
                lang: tab.lang,
                meta: tab.meta,
              }}
              showCopyButton
            />
          </TabsContent>
        )
      })}
    </NpmTabsClient>
  )
}
