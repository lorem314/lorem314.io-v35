"use client"

import { RefObject, useEffect, useRef, useState } from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Node } from "./node"
import { useNodeSystemStore } from "./provider"

import { definedNodes, definedNodesByKey } from "../data/nodes"

// console.log("definedNodes", definedNodes)
// console.log("definedNodesByKey", definedNodesByKey)

export const NodeEditor = () => {
  const addNode = useNodeSystemStore((state) => state.addNode)
  const draftConnection = useNodeSystemStore((state) => state.draftConnection)
  const cancelDraftConnection = useNodeSystemStore(
    (state) => state.cancelDraftConnection,
  )
  const updateDraftConnectionCoord = useNodeSystemStore(
    (state) => state.updateDraftConnectionCoord,
  )

  // const draftConnection = useNodeSystemStore((state) => state.start)
  // const offset = useNodeSystemStore((state) => state.offset)
  // const pan = useNodeSystemStore((state) => state.pan)
  // const [isPanning, setIsPanning] = useState(false)
  // const lastPos = useRef({ x: 0, y: 0 })

  const editorRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const editorNode = editorRef.current
  //   if (!editorNode || !draftConnection) return

  //   const rect = editorNode.getBoundingClientRect()

  //   const handleMouseMove = (event: MouseEvent) => {
  //     const x = event.clientX - rect.left
  //     const y = event.clientY - rect.top

  //     updateDraftConnectionCoord(x, y)
  //   }

  //   const handleMouseClick = (event: MouseEvent) => {
  //     cancelDraftConnection()
  //   }

  //   editorNode.addEventListener("mousemove", handleMouseMove)
  //   editorNode.addEventListener("click", handleMouseClick)

  //   return () => {
  //     editorNode.removeEventListener("mousemove", handleMouseMove)
  //     editorNode.removeEventListener("click", handleMouseClick)
  //   }
  // }, [draftConnection])

  const handleMouseClick = (event: React.MouseEvent) => {
    if (!draftConnection) return
    cancelDraftConnection()
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    const editorNode = editorRef.current
    if (!editorNode || !draftConnection) return

    const rect = editorNode.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    updateDraftConnectionCoord(x, y)
  }

  const handleAddNode = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!editorRef.current) return
    const editorRect = editorRef.current.getBoundingClientRect()

    const nodeKey = event.currentTarget.dataset.nodeKey
    if (!nodeKey) return

    const coord = {
      x: event.clientX - editorRect.left,
      y: event.clientY - editorRect.top,
    }
    addNode(nodeKey, coord)
  }

  // useEffect(() => {
  //   const editorNode = editorRef.current
  //   if (!editorNode) return

  //   const handleMouseDown = (event: MouseEvent) => {
  //     if (event.button === 1) {
  //       console.log("middle mouse down")
  //       event.preventDefault()
  //       setIsPanning(true)
  //       lastPos.current = { x: event.clientX, y: event.clientY }
  //     }
  //   }

  //   const handleMouseMove = (event: MouseEvent) => {
  //     if (!isPanning) return
  //     console.log("panning")

  //     const deltaX = event.clientX - lastPos.current.x
  //     const deltaY = event.clientY - lastPos.current.y

  //     pan(deltaX, deltaY)

  //     lastPos.current = { x: event.clientX, y: event.clientY }
  //   }

  //   const handleMouseUp = () => {
  //     setIsPanning(false)
  //   }

  //   editorNode.addEventListener("mousedown", handleMouseDown)
  //   editorNode.addEventListener("mousemove", handleMouseMove)
  //   editorNode.addEventListener("mouseup", handleMouseUp)

  //   return () => {
  //     editorNode.removeEventListener("mousedown", handleMouseDown)
  //     editorNode.removeEventListener("mousemove", handleMouseMove)
  //     editorNode.removeEventListener("mouseup", handleMouseUp)
  //   }
  // }, [isPanning])

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundSize: `16px 16px`,
          backgroundImage: `
            linear-gradient(to right, #80808012 1px, transparent 1px),
            linear-gradient(to bottom, #80808012 1px, transparent 1px)
          `,
        }}
      >
        <div
          ref={editorRef}
          className="w-full h-full relative"
          data-slot="node-editor"
          onClick={handleMouseClick}
          onMouseMove={handleMouseMove}
        >
          <svg className="absolute w-full h-full inset-0 pointer-events-none">
            <Connections />
          </svg>

          <Nodes editorRef={editorRef} />
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        {definedNodes.map((node) => {
          return (
            <ContextMenuItem
              key={node.key}
              data-node-key={node.key}
              onClick={handleAddNode}
            >
              {node.key}
            </ContextMenuItem>
          )
        })}
      </ContextMenuContent>
    </ContextMenu>
  )
}

// style backgroundPosition: `${offset.x}px ${offset.y}px`,
const GridLayer = ({ style, ...restProps }: React.ComponentProps<"div">) => {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundSize: `16px 16px`,
        backgroundImage: `
          linear-gradient(to right, #80808012 1px, transparent 1px),
          linear-gradient(to bottom, #80808012 1px, transparent 1px)
        `,
        ...style,
      }}
      {...restProps}
    />
  )
}

const Nodes = ({
  editorRef,
}: {
  editorRef: RefObject<HTMLDivElement | null>
}) => {
  // const nodesById = useNodeSystemStore((state) => state.nodesById)
  const nodesOrder = useNodeSystemStore((state) => state.nodesOrder)

  // console.log("nodesById", nodesById)
  // console.log("nodesOrder", nodesOrder)

  return (
    <>
      {nodesOrder.map((nodeId) => {
        // const node = nodesById[nodeId]
        return <Node key={nodeId} nodeId={nodeId} editorRef={editorRef} />
      })}
    </>
  )
}

const Connections = () => {
  const connectionsOrder = useNodeSystemStore((state) => state.connectionsOrder)

  return (
    <>
      <DraftConnection />
      {connectionsOrder.map((id) => {
        return <Connection key={id} id={id} />
      })}
    </>
  )
}

const DraftConnection = () => {
  const draftConnection = useNodeSystemStore((state) => state.draftConnection)
  const nodesById = useNodeSystemStore((state) => state.nodesById)

  if (!draftConnection) return

  const { coord, portsCoordOffsetByLabel } = nodesById[draftConnection.nodeId]
  const portCoordOffset = portsCoordOffsetByLabel[draftConnection.portLabel]

  const x1 = coord.x + portCoordOffset.x
  const y1 = coord.y + portCoordOffset.y
  const x2 = draftConnection.mouseX
  const y2 = draftConnection.mouseY

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth={2}
      className="stroke-gray-400 pointer-events-none"
    />
  )
}

const Connection = ({ id }: { id: string }) => {
  const connectionsById = useNodeSystemStore((state) => state.connectionsById)
  const connection = connectionsById[id]

  const fromNode = useNodeSystemStore(
    (state) => state.nodesById[connection.from.nodeId],
  )
  const toNode = useNodeSystemStore(
    (state) => state.nodesById[connection.to.nodeId],
  )

  const x1 =
    fromNode.coord.x +
    fromNode.portsCoordOffsetByLabel[connection.from.outputLabel].x
  const y1 =
    fromNode.coord.y +
    fromNode.portsCoordOffsetByLabel[connection.from.outputLabel].y
  const x2 =
    toNode.coord.x + toNode.portsCoordOffsetByLabel[connection.to.inputLabel].x
  const y2 =
    toNode.coord.y + toNode.portsCoordOffsetByLabel[connection.to.inputLabel].y

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth={2}
      className="stroke-gray-400 pointer-events-auto hover:stroke-red-400"
    />
  )
}
