"use client"

import React from "react"
import { useStore } from "zustand"

import {
  type BlogPageStore,
  createBlogPageStore,
  defaultInitState,
} from "../store"
import { BlogItem, CountedTag } from "@/types"

export type BlogPageStoreApi = ReturnType<typeof createBlogPageStore>

export const BlogPageStoreContext = React.createContext<
  BlogPageStoreApi | undefined
>(undefined)

type BlogPageStoreProviderProps = {
  children: React.ReactNode
  allBlogs: BlogItem[]
  allCountedTags: CountedTag[]
  tagCountMap: Map<string, number>
}

export const BlogPageStoreProvider = ({
  children,
  allBlogs,
  allCountedTags,
  tagCountMap,
}: BlogPageStoreProviderProps) => {
  const [store] = React.useState(() =>
    createBlogPageStore({
      ...defaultInitState,
      allBlogs,
      allCountedTags,
      tagCountMap,
    }),
  )

  return (
    <BlogPageStoreContext.Provider value={store}>
      {children}
    </BlogPageStoreContext.Provider>
  )
}

export const useBlogPageStore = <T,>(selector: (store: BlogPageStore) => T) => {
  const blogPageStoreContext = React.useContext(BlogPageStoreContext)

  if (!blogPageStoreContext) {
    throw new Error(
      `useBlogPageStore must be used within <BlogPageStoreProvider />`,
    )
  }

  return useStore(blogPageStoreContext, selector)
}
