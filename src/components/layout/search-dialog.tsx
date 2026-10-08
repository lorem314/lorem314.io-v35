import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SearchIcon, XIcon, AlertCircleIcon, Trash2Icon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { trpc } from "@/trpc/client"
import { keepPreviousData } from "@tanstack/react-query"
import type { RouterOutput } from "@/types/trpc"
import { useSearchHistory, type HistoryItem } from "@/hooks/use-search-history"

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const prevPathnameRef = React.useRef(pathname)

  React.useEffect(() => {
    if (!isOpen) {
      prevPathnameRef.current = pathname
      return
    }
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname
      setIsOpen(false)
    }
  }, [pathname, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <SearchDialogTrigger />

        <DialogContent
          className={cn(
            "flex flex-col",
            "h-svh w-full max-w-full rounded-none",
            "sm:h-[calc(100svh-32px)] sm:max-w-xl sm:rounded-lg",
          )}
          showCloseButton={false}
        >
          <SearchDialogContent setIsOpen={setIsOpen} />

          <SearchDialogFooter />
        </DialogContent>
      </form>
    </Dialog>
  )
}

const SearchDialogTrigger = () => {
  return (
    <DialogTrigger asChild>
      <Button
        className="flex justify-start sm:w-48"
        variant="outline"
        size="lg"
      >
        <SearchIcon />
        <span className="mr-auto hidden sm:inline">搜索</span>
        <KbdGroup className="hidden sm:block">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>/</Kbd>
        </KbdGroup>
      </Button>
    </DialogTrigger>
  )
}

const SearchDialogFooter = () => {
  return (
    <DialogFooter
      className={cn(
        "flex-row justify-center rounded-b-lg border-dashed",
        "sm:flex-row sm:justify-center",
      )}
    >
      <p className="text-muted-foreground">
        搜索功能由 <code>@elasticsearch</code> 实现
      </p>
    </DialogFooter>
  )
}

const SearchDialogContent = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const {
    history,
    add: addHistory,
    remove: removeHistory,
  } = useSearchHistory("global-search-history")
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 256)
  const trimmedDebouncedQuery = debouncedQuery.trim()

  const globalSearchQuery = trpc.search.useQuery(
    { query: trimmedDebouncedQuery },
    {
      enabled: !!trimmedDebouncedQuery,
      placeholderData: keepPreviousData,
      staleTime: 24 * 60 * 60 * 1000,
    },
  )

  return (
    <>
      <DialogHeader className="">
        <div className="flex flex-row items-center gap-4">
          <InputGroup className="h-10">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="全站搜索..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="sm:hidden"
                variant="outline"
                size="icon-lg"
                onClick={() => setIsOpen(false)}
              >
                <XIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">关闭</TooltipContent>
          </Tooltip>
        </div>

        {/* <DialogDescription>hleo</DialogDescription> */}
      </DialogHeader>

      <div className="no-scrollbar h-full overflow-auto">
        {trimmedDebouncedQuery.length === 0 ? (
          <div>
            {/* <div className="text-center">show search history</div> */}
            <div className="text-muted-foreground mb-4 text-center">
              历史记录
            </div>
            <SearchHistory history={history} removeHistory={removeHistory} />
          </div>
        ) : globalSearchQuery.isError ? (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>搜索失败</AlertTitle>
            <AlertDescription>
              {globalSearchQuery.error.message}
            </AlertDescription>
          </Alert>
        ) : globalSearchQuery.isFetching ? (
          <div className="mt-8 flex justify-center">
            <Spinner className="size-8" />
          </div>
        ) : globalSearchQuery.data?.hits.hits.length === 0 ? (
          <NoResult />
        ) : (
          <SearchResultHitsHits
            hits={globalSearchQuery.data?.hits.hits}
            addHistory={addHistory}
          />
        )}
      </div>
    </>
  )
}

const SearchHistory = ({
  history,
  removeHistory,
}: {
  history: HistoryItem[]
  removeHistory: (url: HistoryItem["url"]) => void
}) => {
  return (
    <ItemGroup>
      {history.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>无记录</EmptyTitle>
            <EmptyDescription>无历史搜索记录</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        history.map((item) => {
          return (
            <Item key={item.url}>
              <ItemContent>
                <ItemTitle className="pb-px hover:underline">
                  <Link className="text-link-foreground" href={item.url}>
                    {item.title}
                  </Link>
                </ItemTitle>
                {item.description ? (
                  <ItemDescription>{item.description}</ItemDescription>
                ) : null}
              </ItemContent>

              <ItemActions>
                <Button
                  size={"icon"}
                  variant="outline"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    removeHistory(item.url)
                  }}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </ItemActions>
            </Item>
          )
        })
      )}
    </ItemGroup>
  )
}

const NoResult = () => {
  return (
    <Empty>
      <EmptyHeader>
        {/* <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia> */}
        <EmptyTitle>无结果</EmptyTitle>
        <EmptyDescription>没有找到匹配关键字的结果...</EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent>
        <Button>Add data</Button>
      </EmptyContent> */}
    </Empty>
  )
}

const SearchResultHitsHits = ({
  hits,
  addHistory,
}: {
  hits?: RouterOutput["search"]["hits"]["hits"]
  addHistory: (newHistoryItem: HistoryItem) => void
}) => {
  if (!hits) return <NoResult />
  return (
    <ItemGroup>
      {hits.map((hit, hitIndex) => {
        const innerHitsHitsHits = hit.innerHits.structuredContents.hits.hits
        return (
          <Item key={hit.id ?? hitIndex} variant={"outline"}>
            <ItemContent>
              {hit.source.title ? (
                <ItemTitle className="pb-px hover:underline">
                  <Link
                    href={hit.id ?? ""}
                    className="text-link-foreground"
                    onClick={() => {
                      addHistory({
                        url: hit.id,
                        title: hit.source.title,
                        description: hit.source.description,
                      })
                    }}
                  >
                    {hit.highlight.title ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: hit.highlight.title,
                        }}
                      />
                    ) : (
                      <span>{hit.source.title}</span>
                    )}
                  </Link>
                </ItemTitle>
              ) : null}
              {hit.highlight.description ? (
                <ItemDescription
                  dangerouslySetInnerHTML={{
                    __html: hit.highlight.description,
                  }}
                />
              ) : (
                <ItemDescription>{hit.source.description}</ItemDescription>
              )}
            </ItemContent>
            <ItemFooter>
              <SearchResultInnerHitsHitsHits
                href={hit.id ?? ""}
                hits={innerHitsHitsHits}
                addHistory={addHistory}
              />
            </ItemFooter>
          </Item>
        )
      })}
    </ItemGroup>
  )
}

const SearchResultInnerHitsHitsHits = ({
  href,
  hits,
  addHistory,
}: {
  href: string
  hits: RouterOutput["search"]["hits"]["hits"][number]["innerHits"]["structuredContents"]["hits"]["hits"]
  addHistory: (newHistoryItem: HistoryItem) => void
}) => {
  if (!hits) return null

  return (
    <ItemGroup>
      {hits.map((hit, index) => {
        return (
          <Item key={index} size={"sm"} asChild>
            <Link
              href={`${href}#${hit.source.heading}`}
              onClick={() => {
                addHistory({
                  url: `${href}#${hit.source.heading}`,
                  title: hit.source.heading,
                  description: hit.source.content,
                })
              }}
            >
              <ItemContent>
                <ItemTitle className="text-link-foreground pb-px hover:underline">
                  {hit.source.heading}
                </ItemTitle>

                {hit.highlight.content ? (
                  <ItemDescription
                    dangerouslySetInnerHTML={{
                      __html: hit.highlight.content,
                    }}
                  />
                ) : (
                  <ItemDescription>{hit.source.content}</ItemDescription>
                )}
              </ItemContent>
            </Link>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
