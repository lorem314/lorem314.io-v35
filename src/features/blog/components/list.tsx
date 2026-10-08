"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  FileTextIcon,
  CalendarIcon,
  Calendar1Icon,
  CalendarX2Icon,
  CodeIcon,
  Code2Icon,
  CodeSquareIcon,
  CodeXmlIcon,
  ImageIcon,
  ImagesIcon,
} from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
  ItemFooter,
  ItemActions,
} from "@/components/ui/item"

import { useBlogPageStore } from "./context"
import { filterBlogs } from "../lib/utils"
import { BlogItem } from "@/types"
import { Paginator } from "@/components/custom-ui/paginator"
import { getRelativeTimeString } from "@/lib/format"

export const List = ({ className }: { className?: string }) => {
  const allBlogs = useBlogPageStore((state) => state.allBlogs)

  const pageSize = useBlogPageStore((store) => store.pageSize)

  const currentPage = useBlogPageStore((store) => store.currentPage)
  const setCurrentPage = useBlogPageStore((store) => store.setCurrentPage)

  const search = useBlogPageStore((store) => store.search)
  const selectedTags = useBlogPageStore((store) => store.selectedTags)
  const tagFilterLogic = useBlogPageStore((store) => store.tagFilterLogic)

  const filter = React.useMemo(
    () => ({ search, selectedTags, tagFilterLogic }),
    [search, selectedTags, tagFilterLogic],
  )
  const deferredFilter = React.useDeferredValue(filter)
  const filteredBlogs = React.useMemo(
    () => filterBlogs(allBlogs, deferredFilter),
    [allBlogs, deferredFilter],
  )

  const totalPage = Math.ceil(filteredBlogs.length / pageSize) || 1

  const start = (currentPage - 1) * pageSize
  const end = currentPage * pageSize
  const slicedBlogs = filteredBlogs.slice(start, end)

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>博客列表</CardTitle>
      </CardHeader>
      <CardContent className="@container">
        {slicedBlogs.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>无结果</EmptyTitle>
              <EmptyDescription>没有符合筛选条件的博客...</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <Paginator
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={totalPage}
            />
            <BlogList blogs={slicedBlogs} />
            <Paginator
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={totalPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

const BlogList = ({ blogs }: { blogs: BlogItem[] }) => {
  return (
    <ItemGroup
      className={cn(
        "grid grid-cols-1 gap-6",
        "@xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4",
        "my-8",
      )}
    >
      {blogs.map((blog, index) => {
        return (
          <Link href={blog.url} key={blog.id}>
            <BlogCard key={index} blog={blog} />
          </Link>
        )
      })}
    </ItemGroup>
  )
}

const BlogCard = ({ blog }: { blog: BlogItem }) => {
  return (
    <article
      className={cn(
        "group rounded-lg border",
        "shadow transition-shadow duration-300 hover:shadow-xl",
      )}
    >
      <BlogCardHeader blog={blog} />
      <BlogCardContent blog={blog} />
      <BlogCardFooter blog={blog} />
    </article>
  )
}

const BlogCardHeader = ({ blog }: { blog: BlogItem }) => {
  return (
    <header
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-t-lg",
      )}
    >
      <Image
        className={cn(
          "object-cover group-hover:scale-105",
          "transition-transform duration-300",
        )}
        src={blog.cover || "/image/blog/default-cover.webp"}
        alt={blog.title}
        loading="eager"
        sizes="(max-width: 768px) 100vw, 25vw"
        fill
      />
    </header>
  )
}

const BlogCardContent = ({ blog }: { blog: BlogItem }) => {
  return (
    <section>
      <div
        className={cn(
          "flex flex-wrap items-start gap-x-1.5 gap-y-2",
          "mt-2.5 mb-2 h-17 px-2.5",
          "line-clamp-2",
        )}
      >
        {blog.tags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "mx-1 my-1 inline-block rounded border px-2 py-0.5 text-sm",
            )}
          >
            {tag}
          </span>
        ))}
      </div>
      <h3
        className={cn(
          "mt-2 mb-2.5 line-clamp-2 h-12 px-4 text-base font-bold",
          "group-hover:text-link-foreground transition-colors",
        )}
      >
        {blog.title}
      </h3>
      <p
        className={cn(
          "text-muted-foreground my-2.5 px-4 text-sm leading-relaxed",
          "line-clamp-5 min-h-[5lh]",
        )}
      >
        {blog.description}
      </p>
    </section>
  )
}

const BlogCardFooter = ({ blog }: { blog: BlogItem }) => {
  const stats = [
    {
      icon: CalendarIcon,
      prefix: "",
      count: getRelativeTimeString(blog.createdAt, new Date(), {
        space: true,
      }),
      suffix: "",
    },
    {
      icon: FileTextIcon,
      prefix: "约 ",
      count: blog.stats?.wordCount || 0,
      suffix: " 字",
    },
    {
      icon: Code2Icon,
      prefix: "",
      count: blog.stats?.codeBlockCount || 0,
      suffix: " 代码块",
    },
    {
      icon: ImageIcon,
      prefix: "",
      count: blog.stats?.imageCount || 0,
      suffix: " 图片",
    },
  ]

  return (
    <footer
      className={cn(
        "mt-3 mb-2.5 border-t border-dashed pt-2.5",
        "flex flex-wrap items-center gap-2.5 px-2.5",
      )}
    >
      {stats.map((stat, index) => {
        return !stat.count ? null : (
          <div
            key={index}
            className="text-muted-foreground flex items-center gap-1"
          >
            <stat.icon size={14} />
            <span className="text-xs">
              {stat.prefix}
              {stat.count.toLocaleString()}
              {stat.suffix}
            </span>
          </div>
        )
      })}
    </footer>
  )

  // return (
  //   <ItemFooter className="border-t border-dashed px-2.5 py-2.5">
  //     <ul className="flex items-center gap-2.5">
  //       {stats.map((stat, index) => {
  //         return (
  //           <li
  //             key={index}
  //             className="text-muted-foreground flex items-center gap-1"
  //           >
  //             <stat.icon className="size-4" />
  //             <span className="text-xs">{stat.text}</span>
  //           </li>
  //         )
  //       })}
  //     </ul>
  //   </ItemFooter>
  // )
}
