"use client"

import React from "react"
import { Trash2Icon, ChevronDownIcon, XIcon, ChevronUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// import { useContext } from "./context"
import { useDebounce } from "@/hooks/use-debounce"
import { useClickOutside } from "@/hooks/use-click-outside"
import { LogicOrIcon, LogicAndIcon } from "@/components/icon"
import { useBlogPageStore } from "./context"
import { recycleRange } from "../lib/utils"

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "Numpad8", "Numpad2"]
const CONFIRM_KEYS = ["Enter", "NumpadEnter", "Space"]
const BACKSPACE_KEYS = ["Backspace"]
const CLOSE_KEYS = ["Escape"]

const LI_HEIGHT = 32
const LI_MAX_VIEW_NUMBER = 7

export const Select = React.memo(({ className }: { className?: string }) => {
  const allCountedTags = useBlogPageStore((state) => state.allCountedTags)

  const tagFilterLogic = useBlogPageStore((state) => state.tagFilterLogic)
  const toggleTagFilterLogic = useBlogPageStore(
    (state) => state.toggleTagFilterLogic,
  )
  const selectedTags = useBlogPageStore((state) => state.selectedTags)
  const selectTag = useBlogPageStore((state) => state.selectTag)
  const unselectLastTag = useBlogPageStore((state) => state.unselectLastTag)
  const clearSelectedTags = useBlogPageStore((state) => state.clearSelectedTags)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const optionsRef = React.useRef<HTMLUListElement>(null)

  const clickOutsideRef = React.useRef<HTMLDivElement>(null)
  useClickOutside(clickOutsideRef, () => setIsOpen(false), "mousedown")

  const [isOpen, setIsOpen] = React.useState(false)
  const toggleIsOpen = React.useCallback(
    () => setIsOpen((prevIsOpen) => !prevIsOpen),
    [],
  )
  const isOpenRef = React.useRef(isOpen)
  React.useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const hoveredIndexRef = React.useRef(hoveredIndex)
  React.useEffect(() => {
    hoveredIndexRef.current = hoveredIndex
  }, [hoveredIndex])
  const isHoverDisabledRef = React.useRef(false)

  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 256)

  const filteredOptions = React.useMemo(
    () =>
      allCountedTags.filter((tag) => {
        if (debouncedSearch === "") return true
        return tag.name.includes(debouncedSearch)
      }),
    [debouncedSearch, allCountedTags],
  )
  const filteredOptionsRef = React.useRef(filteredOptions)
  React.useEffect(() => {
    filteredOptionsRef.current = filteredOptions
  }, [filteredOptions])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const inputNode = inputRef.current
      const optionsNode = optionsRef.current
      if (!inputNode || !optionsNode) return

      if (ARROW_KEYS.includes(event.code)) {
        event.preventDefault()
        isHoverDisabledRef.current = true
        setTimeout(() => {
          isHoverDisabledRef.current = false
        }, 0)
        if (hoveredIndexRef.current === null) {
          if (["ArrowUp", "Numpad8"].includes(event.code)) {
            setHoveredIndex(filteredOptionsRef.current.length - 1)
            optionsNode.scrollTop = optionsNode.scrollHeight
          } else if (["ArrowDown", "Numpad2"].includes(event.code)) {
            setHoveredIndex(0)
            optionsNode.scrollTop = 0
          }
        } else {
          const rangeMax = filteredOptionsRef.current.length - 1

          let nextHoveredIndex = null
          const base = hoveredIndexRef.current
          if (["ArrowUp", "Numpad8"].includes(event.code)) {
            nextHoveredIndex = recycleRange(base, -1, [0, rangeMax])
          } else if (["ArrowDown", "Numpad2"].includes(event.code)) {
            nextHoveredIndex = recycleRange(base, 1, [0, rangeMax])
          }

          if (nextHoveredIndex === null) return
          setHoveredIndex(nextHoveredIndex)

          const nextHoveredLi = optionsNode.querySelector<HTMLLIElement>(
            `li:nth-of-type(${nextHoveredIndex + 1})`,
          )
          if (!nextHoveredLi) return
          nextHoveredLi.scrollIntoView({ block: "nearest", behavior: "auto" })
        }
      } else if (CONFIRM_KEYS.includes(event.code)) {
        event.preventDefault()
        if (!isOpenRef.current) setIsOpen(true)
        else {
          if (hoveredIndexRef.current !== null) {
            const index = hoveredIndexRef.current
            const tagName = filteredOptionsRef.current[index].name
            selectTag(tagName)
            setSearch("")
          }
          if (!event.shiftKey) {
            console.log("should set open")
            setIsOpen(false)
          }
        }
      } else if (BACKSPACE_KEYS.includes(event.code)) {
        if (inputNode.value === "") {
          console.log("remove")
          unselectLastTag()
        }
      } else if (CLOSE_KEYS.includes(event.code)) {
        event.preventDefault()
        setIsOpen(false)
      }
    },
    [selectTag],
  )

  const actions = [
    {
      Icon: XIcon,
      handleClick: () => setSearch(""),
      tip: "删除筛选文本",
    },
    {
      Icon: tagFilterLogic === "OR" ? LogicOrIcon : LogicAndIcon,
      handleClick: toggleTagFilterLogic,
      tip: tagFilterLogic === "OR" ? "或筛选" : "与筛选",
    },
    {
      Icon: Trash2Icon,
      handleClick: () => clearSelectedTags(),
      tip: "清空标签",
    },
    {
      Icon: isOpen ? ChevronUpIcon : ChevronDownIcon,
      handleClick: toggleIsOpen,
      tip: isOpen ? "关闭" : "打开",
    },
  ]

  return (
    <Card className={cn("overflow-visible", className)}>
      <CardHeader>
        <CardTitle className="">筛选</CardTitle>
      </CardHeader>

      <CardContent className="relative" ref={clickOutsideRef}>
        <InputGroup className="h-11">
          <SelectedTags />

          <InputGroupInput
            className={cn(selectedTags.length > 0 ? "pl-0" : "")}
            ref={inputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setIsOpen(true)}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
          />

          <InputActions actions={actions} />
        </InputGroup>

        <ul
          ref={optionsRef}
          style={{ maxHeight: LI_MAX_VIEW_NUMBER * LI_HEIGHT }}
          className={cn(
            isOpen ? "block" : "hidden",
            "absolute top-full right-4 left-4 z-30",
            "bg-background my-2.5 rounded-lg border shadow-lg",
            "overflow-auto",
          )}
        >
          <CountedTags
            isHoverDisabledRef={isHoverDisabledRef}
            setIsOpen={setIsOpen}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            setSearch={setSearch}
            countedTags={filteredOptions}
          />
        </ul>
      </CardContent>
    </Card>
  )
})

const SelectedTags = () => {
  const selectedTags = useBlogPageStore((state) => state.selectedTags)
  const selectTag = useBlogPageStore((state) => state.selectTag)

  if (selectedTags.length === 0) return null

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tagName = event.currentTarget.dataset["tagName"]
    if (!tagName) return
    selectTag(tagName)
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 self-stretch overflow-auto",
        "no-scrollbar max-w-2/3 px-1.5",
      )}
    >
      {selectedTags.map((tag) => {
        return (
          <Button key={tag} data-tag-name={tag} onClick={handleClick}>
            <span>{tag}</span>
            <XIcon />
          </Button>
        )
      })}
    </div>
  )
}

const InputActions = ({
  actions,
}: {
  actions: { Icon: React.ElementType; handleClick: () => void; tip: string }[]
}) => {
  return (
    <InputGroupAddon align={"inline-end"} className="pr-2.5">
      {actions.map((action) => {
        return (
          <Tooltip key={action.tip}>
            <TooltipTrigger asChild>
              <InputGroupButton
                className="text-muted-foreground"
                size="icon-sm"
                onClick={action.handleClick}
              >
                <action.Icon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>{action.tip}</TooltipContent>
          </Tooltip>
        )
      })}
    </InputGroupAddon>
  )
}

const CountedTags = ({
  isHoverDisabledRef,
  setIsOpen,
  hoveredIndex,
  setHoveredIndex,
  setSearch,
  countedTags,
}: {
  isHoverDisabledRef: React.RefObject<boolean>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  hoveredIndex: number | null
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  countedTags: { name: string; count: number }[]
}) => {
  const selectedTags = useBlogPageStore((state) => state.selectedTags)
  const selectTag = useBlogPageStore((state) => state.selectTag)

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      const tagName = event.currentTarget.dataset["tagName"]
      if (!tagName) return
      setSearch("")
      selectTag(tagName)
      if (event.shiftKey) setIsOpen(true)
      else setIsOpen(false)
    },
    [],
  )

  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      if (isHoverDisabledRef.current) {
        return
      }
      const rawIndex = event.currentTarget.dataset["index"]
      if (!rawIndex) return
      const index = parseInt(rawIndex)
      if (Number.isNaN(index)) return
      setHoveredIndex(index)
    },
    [],
  )

  if (countedTags.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>无结果</EmptyTitle>
          <EmptyDescription>没有符合筛选条件的标签...</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return countedTags.map((countedTag, index) => {
    const isHovered = hoveredIndex === index
    const isSelected = selectedTags.includes(countedTag.name)

    // return (
    //   <li
    //     key={countedTag.name}
    //     className={cn(
    //       "flex h-8 items-center justify-between px-2.5",
    //       "select-none",
    //       isHovered ? "bg-accent text-accent-foreground" : "",
    //       isSelected
    //         ? "bg-primary text-primary-foreground hover:bg-primary/80"
    //         : "",
    //       isSelected && isHovered ? "bg-primary/80" : "",
    //     )}
    //     data-tag-name={countedTag.name}
    //     data-index={index}
    //     onMouseEnter={handleMouseEnter}
    //     onClick={handleClick}
    //   >
    //     <span>{countedTag.name}</span>
    //     <Badge variant="secondary" className="rounded-sm">
    //       {countedTag.count}
    //     </Badge>
    //   </li>
    // )

    return (
      <MemoedCountedTag
        key={countedTag.name}
        index={index}
        countedTag={countedTag}
        isHovered={isHovered}
        isSelected={isSelected}
        handleClick={handleClick}
        handleMouseEnter={handleMouseEnter}
      />
    )
  })
}

const CountedTag = ({
  countedTag,
  index,
  isHovered,
  isSelected,
  handleClick,
  handleMouseEnter,
}: {
  countedTag: { name: string; count: number }
  index: number
  isHovered: boolean
  isSelected: boolean
  handleClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  handleMouseEnter: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}) => {
  return (
    <li
      key={countedTag.name}
      className={cn(
        "flex h-8 items-center justify-between px-2.5",
        "select-none",
        isHovered ? "bg-accent text-accent-foreground" : "",
        isSelected
          ? "bg-primary text-primary-foreground hover:bg-primary/80"
          : "",
        isSelected && isHovered ? "bg-primary/80" : "",
      )}
      data-tag-name={countedTag.name}
      data-index={index}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <span>{countedTag.name}</span>
      <Badge variant="secondary" className="rounded-sm">
        {countedTag.count}
      </Badge>
    </li>
  )
}

const MemoedCountedTag = React.memo(CountedTag)
