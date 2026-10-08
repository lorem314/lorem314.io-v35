import type { Metadata } from "next"
import { blogSource } from "@/lib/source"

import { BlogPageStoreProvider } from "@/features/blog/components/context"
import { BlogItem } from "@/types"
import { getAllBlogsTagCountMap } from "@/features/blog/lib/utils"

const allBlogs: BlogItem[] = blogSource
  .getPages()
  .map((page) => {
    return {
      id: page.path,
      articleType: page.data.articleType,
      url: page.url,
      title: page.data.title,
      tags: page.data.tags,
      createdAt: page.data.createdAt,
      description: page.data.description,
      cover: page.data.cover,
      bvid: page.data.bvid,
      stats: page.data.stats,
    }
  })
  .sort((prev, next) => {
    return next.createdAt.getTime() - prev.createdAt.getTime()
  })

const tagCountMap = getAllBlogsTagCountMap(allBlogs)

const allCountedTags = Array.from(
  tagCountMap.entries().map(([name, count]) => ({ name, count })),
)

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // console.log("blogSource.getPages", blogSource.getPages())
  return (
    <BlogPageStoreProvider
      allBlogs={allBlogs}
      tagCountMap={tagCountMap}
      allCountedTags={allCountedTags}
    >
      {children}
    </BlogPageStoreProvider>
  )
}

export const metadata: Metadata = {
  title: "博客 - lorem314.io",
}
