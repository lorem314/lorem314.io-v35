import React from "react"

import { useLocalStorage } from "./use-local-storage"

export type HistoryItem = {
  url: string
  title: string
  description?: string
}

const MAX_HISTORY_LENGTH = 10

export const useSearchHistory = (key: string) => {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(key, [])

  const add = React.useCallback((newHistoryItem: HistoryItem) => {
    try {
      setHistory((prevHistory) => {
        const index = prevHistory.findIndex(
          (item) => item.url === newHistoryItem.url,
        )
        if (index !== -1) {
          const splicedHistory = prevHistory.toSpliced(index, 1)
          const nextHistory = [newHistoryItem, ...splicedHistory]
          return nextHistory
        } else {
          const newHistory = [newHistoryItem, ...prevHistory]
          const nextHistory =
            newHistory.length > MAX_HISTORY_LENGTH
              ? newHistory.slice(0, MAX_HISTORY_LENGTH)
              : newHistory
          return nextHistory
        }
      })
    } catch (error) {
      setHistory([])
      console.error("[useSearchHistory] add", error)
    }
  }, [])

  const remove = React.useCallback((url: HistoryItem["url"]) => {
    try {
      const newHistory = history.filter((item) => item.url !== url)
      setHistory(newHistory)
    } catch (error) {
      setHistory([])
      console.error("[useSearchHistory] remove", error)
    }
  }, [])

  return { history, add, remove }
}
