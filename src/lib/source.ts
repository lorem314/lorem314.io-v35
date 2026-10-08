import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import { loader, getSlugs } from "fumadocs-core/source"

import { blogCollections } from "fumadocs-mdx:collections/server"

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogCollections, []),
  slugs: (file) => {
    if (typeof file.data?.slug === "string" && file.data.slug) {
      return file.data.slug.split("/")
    }
    return undefined
  },
})
