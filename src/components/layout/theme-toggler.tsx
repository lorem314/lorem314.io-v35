"use client"

import { type ComponentProps } from "react"
import { cn } from "cn"
// import { SunIcon, MoonIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useGlobalContext } from "./context"

export const ThemeToggler = () => {
  const { theme, setPreferredTheme, preferredTheme } = useGlobalContext()

  const toggleTheme = () => {
    setPreferredTheme(theme === "dark" ? "light" : "dark")
  }

  return preferredTheme === "system" ? null : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <ThemeTogglerIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>切换主题色</TooltipContent>
    </Tooltip>
  )
}

const ThemeTogglerIcon = ({
  className,
  ...restProps
}: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4.5", className)}
      {...restProps}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 3l0 18"></path>
      <path d="M12 9l4.65 -4.65"></path>
      <path d="M12 14.3l7.37 -7.37"></path>
      <path d="M12 19.6l8.85 -8.85"></path>
    </svg>
  )
}
