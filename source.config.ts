import {
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config"
import { pageSchema } from "fumadocs-core/source/schema"
import { remarkImage } from "fumadocs-core/mdx-plugins"
import {
  remarkCodeHike,
  recmaCodeHike,
  type CodeHikeConfig,
} from "codehike/mdx"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import z from "zod"

import { blogFrontmatter } from "@/data/blog-frontmatter"
import { mdxStats } from "@/plugins/mdx-stats"

export const blogCollections = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: blogFrontmatter,
  // postprocess: {
  //   includeProcessedMarkdown: true,
  // },
})

const chConfig: CodeHikeConfig = {
  components: {
    code: "CodeHikePre",
  },
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => {
      return [
        ...v,
        remarkMath,
        [remarkImage, { useImport: false, publicDir: "./public" }],
        [remarkCodeHike, chConfig],
        mdxStats,
      ]
    },

    recmaPlugins: [[recmaCodeHike, chConfig]],

    rehypePlugins: (v) => {
      return [
        rehypeKatex,
        // rehypeUnwrapImages,
        ...v,
      ]
    },
  },
})
