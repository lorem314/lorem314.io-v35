import { RawCode } from "codehike/code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CodeHikePre } from "../pre"

export async function CodeTabs(props: { tabs: RawCode[] }) {
  const { tabs } = props

  return (
    <Tabs defaultValue={tabs[0]?.meta}>
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.meta} value={tab.meta}>
            {tab.meta}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.meta} value={tab.meta}>
          <CodeHikePre
            className="my-0!"
            codeblock={{
              value: tab.value,
              lang: tab.lang,
              meta: tab.meta,
            }}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
