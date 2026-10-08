import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { z } from "zod"

import { CodeTabs } from "./code-tabs"

const Schema = Block.extend({ tabs: z.array(CodeBlock) })

export async function CodeWithTabs(props: unknown) {
  const { tabs } = parseProps(props, Schema)

  return <CodeTabs tabs={tabs} />
}
