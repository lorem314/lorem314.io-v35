import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const NumberInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (newValue: any) => void
}) => {
  return (
    <div className="flex items-center border">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          console.log("minus")
          onChange(value - 1)
        }}
      >
        <MinusIcon />
      </Button>
      <span className="px-2.5 text-center">{value}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          console.log("plus")
          onChange(value + 1)
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
