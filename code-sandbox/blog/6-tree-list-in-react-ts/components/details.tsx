import {
  useState,
  type ComponentProps,
  Children,
  forwardRef,
  useImperativeHandle,
} from "react"
import { ChevronDown, ChevronRight } from "./icons"

export const Details = forwardRef((props: ComponentProps<"details">, ref) => {
  const [isOpen, setIsOpen] = useState(props.open ?? true)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  useImperativeHandle(ref, () => ({ open, close }), [])

  const toggle = () => setIsOpen((prevIsOpen) => !prevIsOpen)

  const childArray = Children.toArray(props.children)
  const [titleElement, ...contentElements] = childArray

  return (
    <details open={isOpen}>
      <summary
        onClick={(event) => {
          event.preventDefault()
          toggle()
        }}
      >
        {isOpen ? <ChevronDown /> : <ChevronRight />}
        {titleElement}
      </summary>

      {contentElements}
    </details>
  )
})
