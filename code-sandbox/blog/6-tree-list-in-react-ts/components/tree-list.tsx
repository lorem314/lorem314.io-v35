import { createRef, forwardRef, useImperativeHandle, useRef } from "react"
import { Details } from "./details"

import { ExpandAll, CollapseAll } from "./icons"

type ItemType = {
  title: string
  items?: ItemType[]
}

export function TreeList({
  title,
  items,
}: {
  title: string
  items: ItemType[]
}) {
  const detailsRef = useRef<{ open: () => void; close: () => void }>(null)
  const itemsRef = useRef<{ openAll: () => void; closeAll: () => void }>(null)

  const openAll = () => {
    detailsRef.current?.open()
    itemsRef.current?.openAll()
  }
  const closeAll = () => {
    detailsRef.current?.close()
    itemsRef.current?.closeAll()
  }

  return (
    <Details ref={detailsRef}>
      <div className="details-header">
        <div>{title}</div>
        <ExpandAll
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            openAll()
          }}
        />
        <CollapseAll
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            closeAll()
          }}
        />
      </div>
      <Items items={items} ref={itemsRef} />
    </Details>
  )
}

const Items = forwardRef(({ items }: { items: ItemType[] }, ref) => {
  const refs = useRef(
    items.map((item) => {
      return createRef<{ openAll: () => void; closeAll: () => void }>()
    }),
  )

  useImperativeHandle(
    ref,
    () => ({
      openAll: () => {
        refs.current.forEach((ref) => ref.current?.openAll())
      },
      closeAll: () => {
        refs.current.forEach((ref) => ref.current?.closeAll())
      },
    }),
    [],
  )

  return (
    <ul className="tree-list">
      {items.map((item, index) => {
        return (
          <li key={index}>
            <Item item={item} ref={refs.current[index]} />
          </li>
        )
      })}
    </ul>
  )
})

const Item = forwardRef(({ item }: { item: ItemType }, ref) => {
  const detailsRef = useRef<{ open: () => void; close: () => void }>(null)
  const itemsRef = useRef<{ openAll: () => void; closeAll: () => void }>(null)

  const openAll = () => {
    detailsRef.current?.open()
    itemsRef.current?.openAll()
  }
  const closeAll = () => {
    detailsRef.current?.close()
    itemsRef.current?.closeAll()
  }

  useImperativeHandle(ref, () => ({ openAll, closeAll }), [])

  if (!item.items) {
    return <span>{item.title}</span>
  }

  return (
    <Details ref={detailsRef}>
      <div className="details-header">
        <div>{item.title}</div>
        <ExpandAll
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            openAll()
          }}
        />
        <CollapseAll
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            closeAll()
          }}
        />
      </div>
      <Items items={item.items} ref={itemsRef} />
    </Details>
  )
})
