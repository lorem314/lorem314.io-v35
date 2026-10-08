"use client"

import { cn } from "cn"
import { XIcon } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

import { useBlogPageStore } from "./context"

export const Search = () => {
  const search = useBlogPageStore((state) => state.search)
  const changeSearch = useBlogPageStore((state) => state.changeSearch)

  return (
    <Card>
      <CardHeader>
        <CardTitle>搜索</CardTitle>
      </CardHeader>
      <CardContent>
        <InputGroup className="h-11">
          <InputGroupInput
            id="blog-search"
            type="search"
            className={cn(
              "[&::-ms-clear]:hidden",
              "[&::-webkit-search-cancel-button]:hidden",
            )}
            value={search}
            onChange={(event) => changeSearch(event.target.value)}
          />

          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  size="icon-sm"
                  onClick={() => changeSearch("")}
                >
                  <XIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>删除搜索文本</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  )
}
