"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { useGlobalContext } from "@/components/layout/context"
import type { PreferredTheme } from "@/types"

const themes = [
  { value: "light", label: "白天" },
  { value: "dark", label: "黑夜" },
  { value: "system", label: "系统" },
]

export default function Page() {
  const {
    preferredTheme,
    setPreferredTheme,
    isLeftDrawerAlwaysCollapsed,
    setIsLeftDrawerAlwaysCollapsed,
  } = useGlobalContext()

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>设置</CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal" className="justify-between">
            <Label htmlFor="preferred-theme" className="font-normal">
              主题色
            </Label>
            <Select
              value={preferredTheme}
              onValueChange={(preferredTheme) => {
                setPreferredTheme(preferredTheme as PreferredTheme)
              }}
            >
              <SelectTrigger className="w-42">
                <SelectValue placeholder="选择主题" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {themes.map((theme) => {
                    return (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="is-left-drawer-always-collapsed"
              className="size-5 rounded-sm"
              checked={isLeftDrawerAlwaysCollapsed}
              onCheckedChange={(checked) => {
                setIsLeftDrawerAlwaysCollapsed(checked as boolean)
              }}
            />
            <FieldLabel
              className="font-normal"
              htmlFor="is-left-drawer-always-collapsed"
            >
              总是折叠左侧抽屉
            </FieldLabel>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
