"use client"

import React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGlobalContext } from "@/components/layout/context"

export const NpmTabsClient = ({
  tabs,
  children,
}: {
  tabs: { title: string }[]
  children: React.ReactNode
}) => {
  const { preferredNpm, setPreferredNpm } = useGlobalContext()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPreferredNpm(event.currentTarget.dataset.preferredNpm || "npm")
  }

  return (
    <Tabs defaultValue={preferredNpm} value={preferredNpm}>
      <TabsList variant="line">
        {tabs.map((tab) => {
          return (
            <TabsTrigger
              key={tab.title}
              value={tab.title}
              onClick={handleClick}
              data-preferred-npm={tab.title}
            >
              {tab.title}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {children}
    </Tabs>
  )
}
