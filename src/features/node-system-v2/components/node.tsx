"use client"

import { useState, useRef, useEffect, RefObject } from "react"
import { CircleIcon } from "lucide-react"

import { NodeInstance } from "../types/node"
import { definedNodesByKey } from "../data/nodes"
import { NodeDefinitionPort } from "../types/node"
import { cn } from "@/lib/utils"
import { useNodeSystemStore } from "./provider"

export const Node = ({
  nodeId,
  editorRef,
}: {
  nodeId: string
  editorRef: RefObject<HTMLDivElement | null>
}) => {
  const node = useNodeSystemStore((state) => state.nodesById[nodeId])
  // console.log(`node ${node.id}`, node)
  const definedNode = definedNodesByKey[node.key]

  const startDraftConnection = useNodeSystemStore(
    (state) => state.startDraftConnection,
  )
  const completeDraftConnection = useNodeSystemStore(
    (state) => state.completeDraftConnection,
  )
  const updateNodeCoord = useNodeSystemStore((state) => state.updateNodeCoord)
  const updateNodeValue = useNodeSystemStore((state) => state.updateNodeValue)
  const updatePortsCoordOffsetByLabel = useNodeSystemStore(
    (state) => state.updatePortsCoordOffsetByLabel,
  )

  const [isDragging, setIsDragging] = useState(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const updatePortsCoord = () => {
    if (!nodeRef.current) return

    const nodeRect = nodeRef.current.getBoundingClientRect()
    const portDots = nodeRef.current.querySelectorAll(`[data-slot="port-dot"]`)

    const offsetsByLabel: Record<string, { x: number; y: number }> = {}

    portDots.forEach((dot) => {
      const label = dot.getAttribute("data-port-label")
      if (label) {
        const dotRect = dot.getBoundingClientRect()

        const offsetX = dotRect.left + dotRect.width / 2 - nodeRect.left
        const offsetY = dotRect.top + dotRect.height / 2 - nodeRect.top

        offsetsByLabel[label] = {
          x: offsetX,
          y: offsetY,
        }
      }
    })

    updatePortsCoordOffsetByLabel(node.id, offsetsByLabel)
  }

  useEffect(() => {
    if (!nodeRef.current) return

    updatePortsCoord()

    const observer = new ResizeObserver(() => {
      updatePortsCoord()
    })

    observer.observe(nodeRef.current)

    return () => {
      observer.disconnect()
    }
  }, [nodeId])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && !e.target.closest(".cursor-move"))
      return

    e.stopPropagation()

    const rect = nodeRef.current?.getBoundingClientRect()
    if (!rect) return

    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const editorRect = document
      .querySelector('[data-slot="node-editor"]')
      ?.getBoundingClientRect()

    if (!editorRect) return

    const x = e.clientX - editorRect.left - dragOffsetRef.current.x
    const y = e.clientY - editorRect.top - dragOffsetRef.current.y

    updateNodeCoord(node.id, { x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleStartDraftConnection =
    (portLabel: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      // const rect = nodeRef.current?.getBoundingClientRect()
      const rect = editorRef.current?.getBoundingClientRect()

      if (!rect) return
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      startDraftConnection(node.id, portLabel, x, y)
    }

  const handleCompleteDraftConnection =
    (portLabel: string) => (event: React.MouseEvent<HTMLDivElement>) => {
      completeDraftConnection(node.id, portLabel)
    }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleChange = (portLabel: string) => (newValue: any) => {
    updateNodeValue(node.id, portLabel, newValue)
  }

  return (
    <div
      ref={nodeRef}
      className="bg-background absolute rounded-lg border pb-2 shadow"
      style={{ top: `${node.coord.y}px`, left: `${node.coord.x}px` }}
    >
      <div
        className={cn("cursor-move border-b px-2.5 py-1.5")}
        onMouseDown={handleMouseDown}
      >
        <div>{node.title}</div>
      </div>

      <div className="flex gap-4">
        <NodeInputs
          inputs={definedNode.inputs}
          values={node.inputsValueByLabel}
          onChange={handleChange}
          handleCompleteDraftConnection={handleCompleteDraftConnection}
          inputsConnectionByLabel={node.inputsConnectionByLabel}
        />
        <NodeOutputs
          nodeId={node.id}
          outputs={definedNode.outputs}
          values={node.outputsValueByLabel}
          onChange={handleChange}
          handleStartDraftConnection={handleStartDraftConnection}
          outputsConnectionsByLabel={node.outputsConnectionsByLabel}
        />
      </div>
    </div>
  )
}

const NodeInputs = ({
  inputs,
  values,
  onChange,
  handleCompleteDraftConnection,
  inputsConnectionByLabel,
}: {
  inputs: NodeDefinitionPort[]
  values: Record<string, any>
  onChange: (portLabel: string) => (newValue: any) => void
  handleCompleteDraftConnection: (
    portLabel: string,
  ) => (event: React.MouseEvent<HTMLDivElement>) => void
  inputsConnectionByLabel: Record<string, string | null>
}) => {
  return (
    <div data-slot="node-inputs">
      {inputs.map((input) => {
        const { Element, props } = input?.renderer || {}
        return (
          <div
            className="flex -translate-x-2 items-center gap-2.5"
            key={input.label}
          >
            <PortDot
              portLabel={input.label}
              onClick={(event) => {
                console.log("stop propagation")
                event.stopPropagation()
                handleCompleteDraftConnection(input.label)(event)
              }}
            />
            <div key={input.label}>
              <div>{input.label}</div>
              {inputsConnectionByLabel[input.label] ? (
                <div>{values[input.label]}</div>
              ) : Element ? (
                <Element
                  {...props}
                  value={values[input.label]}
                  onChange={onChange(input.label)}
                />
              ) : (
                <div>{values[input.label]}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const NodeOutputs = ({
  nodeId,
  outputs,
  values,
  onChange,
  handleStartDraftConnection,
  outputsConnectionsByLabel,
}: {
  nodeId: string
  outputs: NodeDefinitionPort[]
  values: Record<string, any>
  onChange: (portLabel: string) => (newValue: any) => void
  handleStartDraftConnection: (
    portLabel: string,
  ) => (event: React.MouseEvent<HTMLDivElement>) => void
  outputsConnectionsByLabel: Record<string, string[]>
}) => {
  return (
    <div data-slot="node-outputs">
      {outputs.map((output) => {
        const { Element, props } = output?.renderer || {}
        return (
          <div
            className="flex translate-x-2 items-center gap-2.5"
            key={output.label}
          >
            <div key={output.label}>
              <div>{output.label}</div>
              {Element ? (
                <Element
                  {...props}
                  value={values[output.label]}
                  onChange={onChange(output.label)}
                />
              ) : (
                <div>{values[output.label]}</div>
              )}
            </div>
            <PortDot
              portLabel={output.label}
              onClick={(event) => {
                handleStartDraftConnection(output.label)(event)
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

const PortDot = ({
  portLabel,
  ...restProps
}: React.ComponentProps<"div"> & { portLabel: string }) => {
  return (
    <div {...restProps} data-slot="port-dot" data-port-label={portLabel}>
      <CircleIcon
        className={cn(
          "size-4",
          "fill-gray-400 text-gray-400",
          "hover:fill-gray-600 hover:text-gray-600",
        )}
      />
    </div>
  )
}
