import { notFound } from "next/navigation"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"

import { blogSource } from "@/lib/source"
import { BreadcrumbNav } from "@/components/custom-ui/breadcrumb-nav"
import { GridOverlay } from "@/components/custom-ui/grid-overlay"
import { Layout } from "@/components/article/layout"
import { Body } from "@/components/article/body"
import { H1 } from "@/components/custom-ui/typography"
import ScrollyCoding from "@/components/codehike/scrollycoding"
import { getDateTimeString } from "@/lib/format"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const blog = blogSource.getPage([slug])
  if (!blog) return notFound()

  if (blog.data.articleType === "scrollycoding") {
    return <ScrollyCoding content={blog.data.body} />
  }

  return (
    <>
      <div className="mx-auto my-4 max-w-screen-2xl">
        <BreadcrumbNav
          className="px-2.5"
          items={[
            { title: "主页", href: "/" },
            { title: "博客", href: "/blog" },
            { title: blog.data.title },
          ]}
        />
      </div>

      <header
        className={cn(
          "border-muted bg-card relative border",
          "mx-auto mb-8 max-w-screen-2xl rounded-lg px-6 py-8",
        )}
      >
        <GridOverlay />
        <H1>{blog.data.title}</H1>
        <ul className="my-4 flex flex-wrap items-center gap-4">
          {blog.data.tags.map((tag, index) => {
            return (
              <li
                key={index}
                className="bg-card z-10 rounded-lg border px-2.5 py-1.5 text-sm font-medium"
              >
                {tag}
              </li>
            )
          })}
        </ul>

        <p>
          发布于{" "}
          <time
            dateTime={`${blog.data.createdAt.toLocaleDateString()}T${blog.data.createdAt.toLocaleTimeString()}`}
          >
            {getDateTimeString(blog.data.createdAt, { space: true })}
          </time>
        </p>
      </header>

      <Layout title={blog.data.title} toc={blog.data.toc}>
        <div className={cn("prose dark:prose-invert mx-auto max-w-[75ch]")}>
          {blog.data.description ? (
            <p className="lead">{blog.data.description}</p>
          ) : null}
          <Body component={blog.data.body} />
        </div>
      </Layout>
    </>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const blog = blogSource.getPage([params.slug])

  if (!blog) return { title: "404 - lorem314.io" }

  return {
    title: `${blog.data.title} - 博客 - lorem314.io`,
  }
}
