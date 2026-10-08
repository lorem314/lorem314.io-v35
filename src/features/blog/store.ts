import { createStore } from "zustand/vanilla"

import { BlogItem, CountedTag } from "@/types"

export type BlogPageStoreState = {
  search: string
  selectedTags: string[]
  tagFilterLogic: "OR" | "AND"
  filteredBlogs: BlogItem[]
  pageSize: number
  currentPage: number
  allBlogs: BlogItem[]
  allCountedTags: CountedTag[]
  tagCountMap: Map<string, number>
}

export type BlogPageStoreActions = {
  changeSearch: (newSearch: string) => void
  selectTag: (tagName: string) => void
  unselectLastTag: () => void
  clearSelectedTags: () => void
  toggleTagFilterLogic: () => void
  setCurrentPage: (currentPage: number) => void
}

export type BlogPageStore = BlogPageStoreState & BlogPageStoreActions

export const defaultInitState = {
  search: "",
  selectedTags: [],
  tagFilterLogic: "OR" as const,
  filteredBlogs: [],
  pageSize: 12,
  currentPage: 1,
  allBlogs: [],
  allCountedTags: [],
  tagCountMap: new Map(),
}

export const createBlogPageStore = (
  initState: BlogPageStoreState = defaultInitState,
) => {
  return createStore<BlogPageStore>()((set) => ({
    ...initState,
    changeSearch: (newSearch) => {
      set(() => ({ search: newSearch, currentPage: 1 }))
    },
    selectTag: (tagName: string) => {
      set((state) => {
        const hasSelected = state.selectedTags.includes(tagName)
        if (hasSelected) {
          const selectedTags = state.selectedTags.filter(
            (selectedTag) => selectedTag !== tagName,
          )
          return { selectedTags, currentPage: 1 }
        } else {
          const selectedTags = [...state.selectedTags, tagName]
          return { selectedTags, currentPage: 1 }
        }
      })
    },
    unselectLastTag: () => {
      set((state) => {
        state.selectedTags.pop()
        return {
          selectedTags: [...state.selectedTags],
        }
      })
    },
    clearSelectedTags: () => {
      set(() => ({ selectedTags: [] }))
    },
    toggleTagFilterLogic: () => {
      set((state) => {
        switch (state.tagFilterLogic) {
          case "AND":
            return { tagFilterLogic: "OR", currentPage: 1 }
          case "OR":
            return { tagFilterLogic: "AND", currentPage: 1 }
          default:
            return state
        }
      })
    },
    setCurrentPage: (currentPage: number) => {
      set(() => {
        return { currentPage }
      })
    },
  }))
}
