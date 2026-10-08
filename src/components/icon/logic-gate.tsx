import { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export const LogicOrIcon = ({
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
      className={cn("", className)}
      {...restProps}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12h-6" />
      <path d="M2 9h7" />
      <path d="M2 15h7" />
      <path d="M8 5c10.667 2.1 10.667 12.6 0 14c1.806 -4.667 1.806 -9.333 0 -14" />
    </svg>
  )
}

export const LogicAndIcon = ({
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
      className={cn("", className)}
      {...restProps}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12h-5" />
      <path d="M2 9h5" />
      <path d="M2 15h5" />
      <path d="M9 5c6 0 8 3.5 8 7s-2 7 -8 7h-2v-14h2" />
    </svg>
  )
}
