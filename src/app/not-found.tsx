"use client"

import Link from "next/link"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      {/* <CardHeader>
        <CardTitle>404</CardTitle>
        <CardDescription>未找到该页面</CardDescription>
      </CardHeader> */}
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>404 - Not Found</EmptyTitle>
            {/* <EmptyDescription>
              The page you&apos;re looking for doesn&apos;t exist. Try searching
              for what you need below.
            </EmptyDescription> */}
            <EmptyDescription>找不到该页面</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {/* <InputGroup className="sm:w-3/4">
              <InputGroupInput placeholder="Try searching for pages..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup> */}

            <Link
              href="/"
              className={cn("", buttonVariants({ variant: "outline" }))}
            >
              返回主页
            </Link>

            {/* <EmptyDescription>
              Need help? <a href="#">Contact support</a>
            </EmptyDescription> */}
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
