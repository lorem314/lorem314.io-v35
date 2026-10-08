import Image from "next/image"
import { ExternalLinkIcon } from "lucide-react"
import type { MDXContent } from "mdx/types"

import { BilibiliIcon } from "../icon"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  ItemMedia,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

import {
  H2,
  H3,
  H4,
  H5,
  H6,
  BlockQuote,
  InlineCode,
} from "../custom-ui/typography"
import { Link } from "../custom-ui/link"

// codehike
import { CodeHikePre } from "../codehike/pre"
import { CodeWithTabs } from "../codehike/code-with-tabs"
import { NpmTabs } from "../codehike/npm-tabs"
import { CodeViewer } from "../codehike/code-viewer"
import { CodeViewerTabs } from "../codehike/code-viewer/tabs"

// sandpack
import { CodeSandbox } from "../sandpack/code-sandbox"

export const Body = ({ component: Comp }: { component: MDXContent }) => {
  return (
    <Comp
      components={{
        // typography
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        h6: H6,
        blockquote: BlockQuote,
        code: InlineCode,
        a: Link,

        // shadcn
        KbdGroup,
        Kbd,

        // codehike
        CodeHikePre,
        CodeWithTabs,
        NpmTabs,
        CodeViewer,
        CodeViewerTabs,

        // sandpack
        CodeSandbox,
      }}
    />
  )
}

export const BilibiliSection = ({ bvid }: { bvid?: string }) => {
  if (!bvid) return null

  return (
    <Item
      variant="outline"
      className="not-prose text-link-foreground my-6 first:mt-0"
      asChild
    >
      <a
        href={`https://www.bilibili.com/video/${bvid}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ItemMedia variant="icon">
          <BilibiliIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>在 Bilibili 上观看该博客的讲解视频</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon className="size-4" />
        </ItemActions>
      </a>
    </Item>
  )
}

export const BlogCover = ({ cover }: { cover: string }) => {
  if (!cover || cover.split("/").at(-1) === "default-cover.webp") {
    return null
  }

  return (
    <div
      className={cn(
        "relative my-4 aspect-video overflow-hidden rounded-lg border",
      )}
    >
      <Image
        className="not-prose"
        src={cover}
        alt=""
        loading="eager"
        sizes="(max-width: 768px) 100vw, 25vw"
        fill
      />
    </div>
  )
}
