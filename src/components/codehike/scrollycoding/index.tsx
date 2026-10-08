import { MDXContent } from "mdx/types"
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection"
import { Block, CodeBlock, parseRoot } from "codehike/blocks"
import { Pre, RawCode, highlight } from "codehike/code"
import { z } from "zod"
import { cn } from "cn"

// import { tokenTransitions } from "../annotations/token-transition"
import { tokenTransitions } from "./token-transition"

const Schema = Block.extend({
  h2s: z.array(
    Block.extend({
      code: CodeBlock.optional(),
      h3s: z
        .array(
          Block.extend({
            code: CodeBlock.optional(),
            h4s: z
              .array(Block.extend({ code: CodeBlock.optional() }))
              .optional(),
          }).optional(),
        )
        .optional(),
    }),
  ),
})

export default function ScrollyCoding({ content }: { content: MDXContent }) {
  const { h2s } = parseRoot(content, Schema)

  // console.log("components/codehike/scrollycoding")
  // console.log("h2s", h2s)

  return (
    <div className="flex">
      <aside className="w-0 bg-green-100">aside</aside>
      <SelectionProvider>
        <div className="sticky top-16 h-[50svh]">
          <div className="h-full overflow-hidden bg-red-100">
            <Selection
              from={h2s.map((h2) => {
                if (!h2.code) return
                return <Code codeblock={h2.code} key={h2.code.meta} />
              })}
            />
          </div>
        </div>
        <div className="">
          {h2s.map((h2, i) => (
            <Selectable
              key={i}
              index={i}
              selectOn={["click", "scroll"]}
              className={cn(
                "border-border mt-32 rounded border-l-4 px-5 py-2",
                "data-[selected=true]:border-primary min-h-[420px]",
                "flex items-center",
              )}
            >
              <div>
                <h2 className="mt-4 text-xl">{h2.title}</h2>
                <div>{h2.children}</div>
              </div>
            </Selectable>
          ))}
        </div>
      </SelectionProvider>
    </div>
  )

  return (
    <div className="absolute inset-0 flex">
      <aside className={cn("bg-red-100", "w-0 shrink-0 xl:w-1/2")}></aside>
      <div className={cn("bg-green-100", "shrink-0 grow")}>
        <div className="pl-0">
          <div className="max-w-[84ch] bg-blue-100">
            <SelectionProvider>
              <div className="ml-[-84ch] flex">
                <div className="basis-1/2 bg-yellow-100">
                  <div className="sticky top-16">
                    {/* <div className="h-1/6">blank</div> */}
                    <Selection
                      from={h2s.map((h2) => {
                        if (!h2.code) return
                        return <Code codeblock={h2.code} key={h2.code.meta} />
                      })}
                    />
                    {/* <div>blank</div> */}
                  </div>
                </div>
                <div className="prose max-w-[84ch]">
                  {h2s.map((h2, i) => (
                    <Selectable
                      key={i}
                      index={i}
                      selectOn={["click", "scroll"]}
                      className={cn(
                        "border-border mb-24 rounded border-l-4 px-5 py-2",
                        "data-[selected=true]:border-primary",
                      )}
                    >
                      <h2 className="mt-4 text-xl">{h2.title}</h2>
                      <div>{h2.children}</div>
                    </Selectable>
                  ))}
                </div>
              </div>
            </SelectionProvider>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <SelectionProvider className="flex gap-6">
      <div
        className="prose dark:prose-invert mt-32 mb-[90vh] ml-2 flex-1"
        data-slot="selectable"
      >
        {h2s.map((h2, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click", "scroll"]}
            className="border-border data-[selected=true]:border-primary mb-24 rounded border-l-4 px-5 py-2"
          >
            <h2 className="mt-4 text-xl">{h2.title}</h2>
            <div>{h2.children}</div>
          </Selectable>
        ))}
      </div>

      <div className="grow text-sm" data-slot="selection">
        <div className="sticky top-16 mx-4 pt-4">
          <div>blank</div>
          <Selection
            from={h2s.map((h2) => {
              if (!h2.code) return
              return <Code codeblock={h2.code} key={h2.code.meta || "code"} />
            })}
          />
          <div></div>
        </div>
      </div>
    </SelectionProvider>
  )
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css")

  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions]}
      className="no-scrollbar transition-transform duration-250 ease-in-out"
      // style={{
      //   transform: `scale(0.85)`,
      //   transformOrigin: "top center",
      // }}
    />
  )
}
