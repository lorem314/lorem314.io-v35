import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { ExternalLink } from "../custom-ui/external-link"

import { routes, footprints } from "@/data"

export function Footer() {
  return (
    <footer className="bg-card border-t border-dashed py-8">
      <div className="mx-auto max-w-7xl pt-4">
        <div className="grid grid-cols-1 space-y-8 px-6 md:grid-cols-8">
          <Intro className="col-span-full md:col-span-3" />
          <Nav className="col-span-full md:col-span-2" />
          <Footprint className="col-span-full md:col-span-3" />
        </div>

        <Techs className="my-6 px-6" />

        <div className="mt-8 mb-4 px-6">
          <Separator />
        </div>

        <Icp className="px-6" />
      </div>
    </footer>
  )
}

const Intro = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-4 text-center md:text-left", className)}>
      <div className="flex justify-center md:justify-start">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/image/avatar.webp"
            width={184}
            height={184}
            alt=""
            className="ring-ring/50 border-ring size-6 rounded border ring-3 group-hover:ring-4"
          />
          <div className="text-lg font-bold">lorem314.io</div>
        </Link>
      </div>
      <div className="text-muted-foreground text-sm">
        个人博客网站，分享优质教程
      </div>
    </div>
  )
}

const Nav = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-center", className)}>
      <div className="mb-4 font-bold">页面导航</div>
      <ul className="my-2.5 space-y-1.5 text-sm">
        {routes.map((route, index) => {
          return (
            <li key={index}>
              <Link
                href={route.href}
                className={cn(
                  "text-foreground/80 hover:text-foreground",
                  "inline-flex items-center gap-2.5",
                )}
              >
                <route.Icon className="size-4" />
                <span>{route.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const Footprint = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-center md:text-right", className)}>
      <div className="mb-4 font-bold">在别处找到我</div>
      <ul
        className={cn(
          "my-2.5 flex flex-col gap-4",
          "justify-center md:justify-end",
        )}
      >
        {footprints.map((footprint, index) => {
          return (
            <li key={index}>
              <ExternalLink
                href={footprint.href}
                iconSize={12}
                className={cn(
                  "inline-flex items-center gap-2.5",
                  "text-foreground/80 hover:text-foreground",
                  "text-muted-foreground rounded-lg border p-1.5",
                  "hover:border-accent-foreground/25 hover:no-underline",
                )}
              >
                <footprint.Icon className="size-5" />
                <span>{footprint.title}</span>
              </ExternalLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const techs = [
  { title: "React", href: "https://react.dev/" },
  { title: "Next.js", href: "https://nextjs.org/" },
  { title: "Fumadocs", href: "https://www.fumadocs.dev/" },
  { title: "Code Hike", href: "https://codehike.org/" },
  { title: "TypeScript", href: "https://www.typescriptlang.org/" },
  { title: "Tailwind CSS", href: "https://tailwindcss.com/" },
  { title: "tRPC", href: "https://trpc.io/" },
  { title: "TanStack", href: "https://tanstack.com/" },
  // { title: "drizzle", href: "https://orm.drizzle.team/" },
  // { title: "postgresql", href: "https://www.postgresql.org/" },
  { title: "Elasticsearch", href: "https://www.elastic.co/" },
  { title: "Sandpack", href: "https://sandpack.codesandbox.io/" },
]

const Techs = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-center", className)}>
      <div className="mb-4 font-bold">技术栈</div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {techs.map((tech, index) => {
          return (
            <ExternalLink
              key={index}
              href={tech.href}
              className={cn(
                "text-muted-foreground rounded-lg border px-2.5 py-0.5 text-sm",
                "hover:text-foreground hover:no-underline",
              )}
              iconSize={12}
            >
              {tech.title}
            </ExternalLink>
          )
        })}
      </div>
    </div>
  )
}

const Icp = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-muted-foreground text-center", className)}>
      互联网ICP备案：
      <ExternalLink
        className="text-muted-foreground"
        href="https://beian.miit.gov.cn/"
        target="_blank"
      >
        京ICP备2024101464号-1
      </ExternalLink>
    </div>
  )
}
