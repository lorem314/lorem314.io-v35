import { createStore } from "zustand/vanilla"
import { immer } from "zustand/middleware/immer"
import { generateId } from "../lib/utils"

import type { NodeInstance, NodeDefinition, PortByLabel } from "../types/node"
import type { Connection } from "../types/connection"

import { definedNodes, definedNodesByKey } from "../data/nodes"

export type NodeSystemState = {
  offset: { x: number; y: number }

  nodesById: Record<string, NodeInstance>
  nodesOrder: string[]

  draftConnection: {
    nodeId: string
    portLabel: string
    mouseX: number
    mouseY: number
  } | null

  connectionsById: Record<string, Connection>
  connectionsOrder: string[]
}

export type NodeSystemActions = {
  pan: (deltaX: number, deltaY: number) => void
  addNode: (key: string, coord: { x: number; y: number }) => void
  updateNodeCoord: (nodeId: string, newCoord: NodeInstance["coord"]) => void
  updateNodeValue: (nodeId: string, portLabel: string, newValue: any) => void
  updatePortsCoordOffsetByLabel: (
    nodeId: string,
    initPortsCoordOffsetByLabel: NodeInstance["portsCoordOffsetByLabel"],
  ) => void
  startDraftConnection: (
    nodeId: string,
    portLabel: string,
    mouseX: number,
    mouseY: number,
  ) => void
  updateDraftConnectionCoord: (x: number, y: number) => void
  completeDraftConnection: (nodeId: string, portLabel: string) => void
  cancelDraftConnection: () => void
}

export type NodeSystemStore = NodeSystemState & NodeSystemActions

export const defaultInitState: NodeSystemState = {
  offset: { x: 0, y: 0 },

  nodesById: {},
  nodesOrder: [],

  draftConnection: null,
  connectionsById: {},
  connectionsOrder: [],
}

export const createNodeSystemStore = (
  initState: NodeSystemState = defaultInitState,
) => {
  return createStore<NodeSystemStore>()(
    immer((set, get) => ({
      ...initState,
      pan: (deltaX, deltaY) => {
        set((state) => ({
          offset: {
            x: state.offset.x + deltaX,
            y: state.offset.y + deltaY,
          },
        }))
      },
      addNode(key, coord) {
        const id = generateId()
        const definedNode = definedNodesByKey[key]

        const inputsValueByLabel = definedNode.inputs.reduce(
          (acc, input) => {
            return { ...acc, [input.label]: input.defaultValue }
          },
          {} as PortByLabel<typeof definedNode.inputs>,
        )

        const outputsValueByLabel = definedNode.compute
          ? definedNode.compute(inputsValueByLabel)
          : definedNode.outputs.reduce(
              (acc, output) => {
                return { ...acc, [output.label]: output.defaultValue }
              },
              {} as PortByLabel<typeof definedNode.inputs>,
            )

        const inputsConnectionByLabel = definedNode.inputs.reduce(
          (acc, input) => {
            return { ...acc, [input.label]: null }
          },
          {} as NodeInstance["inputsConnectionByLabel"],
        )
        const outputsConnectionsByLabel = definedNode.outputs.reduce(
          (acc, output) => {
            return { ...acc, [output.label]: [] }
          },
          {} as NodeInstance["outputsConnectionsByLabel"],
        )

        set((state) => {
          return {
            nodesById: {
              ...state.nodesById,
              [id]: {
                id,
                key: definedNode.key,
                title: definedNode.title,
                coord,
                inputsValueByLabel,
                outputsValueByLabel,
                portsCoordOffsetByLabel: {},
                inputsConnectionByLabel,
                outputsConnectionsByLabel,
              },
            },
            nodesOrder: [...state.nodesOrder, id],
          }
        })
      },
      updateNodeCoord(nodeId, newCoord) {
        set((state) => {
          const node = state.nodesById[nodeId]
          if (!node) return state

          return {
            nodesById: {
              ...state.nodesById,
              [nodeId]: { ...node, coord: newCoord },
            },
          }
        })
      },
      updateNodeValue(nodeId, portLabel, newValue) {
        set((state) => {
          const queue = []

          const node = state.nodesById[nodeId]
          const nodeDef = definedNodesByKey[node.key]

          if (nodeDef.compute) {
            // input value changed
            node.inputsValueByLabel[portLabel] = newValue
            const oldOutputsValueByLabel = node.outputsValueByLabel
            node.outputsValueByLabel = nodeDef.compute(
              node.inputsValueByLabel as PortByLabel<typeof nodeDef.inputs>,
            )
            nodeDef.outputs.forEach((output) => {
              const oldValue = oldOutputsValueByLabel[output.label]
              if (oldValue !== node.outputsValueByLabel[output.label]) {
                queue.push(...node.outputsConnectionsByLabel[output.label])
              }
            })
          } else {
            // output value changed
            const oldValue = node.outputsValueByLabel[portLabel]

            if (oldValue === newValue) return

            node.outputsValueByLabel[portLabel] = newValue

            // add all connections of this output to queue
            queue.push(...node.outputsConnectionsByLabel[portLabel])
          }

          while (queue.length !== 0) {
            const cid = queue.shift()
            if (!cid) break

            const connection = state.connectionsById[cid]
            const fromNode = state.nodesById[connection.from.nodeId]
            const toNode = state.nodesById[connection.to.nodeId]
            const toNodeDef = definedNodesByKey[toNode.key]

            // change `toNode` input value to `fromNode` output value of cid
            toNode.inputsValueByLabel[connection.to.inputLabel] =
              fromNode.outputsValueByLabel[connection.from.outputLabel]

            // re-compute toNode
            if (!toNodeDef.compute) break
            const oldOutputsValueByLabel = toNode.outputsValueByLabel
            toNode.outputsValueByLabel = toNodeDef.compute(
              toNode.inputsValueByLabel as PortByLabel<typeof toNodeDef.inputs>,
            )

            toNodeDef.outputs.forEach((output) => {
              // old output value !== new output value
              // add output cid to queue
              const toNodeOutputConnections =
                toNode.outputsConnectionsByLabel[output.label]
              if (
                oldOutputsValueByLabel[output.label] !==
                  toNode.outputsValueByLabel[output.label] &&
                toNodeOutputConnections.length !== 0
              ) {
                queue.push(...toNodeOutputConnections)
              }
            })
          }

          // const node = state.nodesById[nodeId]
          // if (!node) return state
          // const definedNode = definedNodesByKey[node.key]
          // if (definedNode.compute) {
          //   const newInputsValueByLabel: PortByLabel<
          //     typeof definedNode.inputs
          //   > = { ...node.inputsValueByLabel }
          //   if (node.inputsValueByLabel[portLabel] !== undefined) {
          //     newInputsValueByLabel[portLabel] = newValue
          //   }
          //   const newOutputsValueByLabel: Record<string, any> =
          //     definedNode.compute(newInputsValueByLabel)
          //   return {
          //     nodesById: {
          //       ...state.nodesById,
          //       [nodeId]: {
          //         ...node,
          //         inputsValueByLabel: newInputsValueByLabel,
          //         outputsValueByLabel: newOutputsValueByLabel,
          //       },
          //     },
          //   }
          // } else {
          //   if (node.outputsValueByLabel[portLabel] !== undefined) {
          //     return {
          //       nodesById: {
          //         ...state.nodesById,
          //         [nodeId]: {
          //           ...node,
          //           outputsValueByLabel: {
          //             ...node.outputsValueByLabel,
          //             [portLabel]: newValue,
          //           },
          //         },
          //       },
          //     }
          //   } else {
          //     console.warn(`${portLabel} not exist on Node ${nodeId}`)
          //   }
          // }

          // return state
        })
      },
      updatePortsCoordOffsetByLabel(nodeId, initPortsCoordOffsetByLabel) {
        set((state) => {
          const node = state.nodesById[nodeId]
          if (!node) return state

          return {
            nodesById: {
              ...state.nodesById,
              [nodeId]: {
                ...node,
                portsCoordOffsetByLabel: initPortsCoordOffsetByLabel,
              },
            },
          }
        })
      },
      startDraftConnection(nodeId, portLabel, mouseX, mouseY) {
        set((state) => {
          return { draftConnection: { nodeId, portLabel, mouseX, mouseY } }
        })
      },
      completeDraftConnection(nodeId, portLabel) {
        const { nodesById, draftConnection } = get()

        if (!draftConnection) return

        if (draftConnection.nodeId === nodeId) {
          console.log("same node, should cancel")
          set(() => ({
            draftConnection: null,
          }))
          return
        }

        // should check loop connection

        const id = generateId()

        const connection: Connection = {
          id,
          from: {
            nodeId: draftConnection.nodeId,
            outputLabel: draftConnection.portLabel,
          },
          to: { nodeId, inputLabel: portLabel },
        }

        set((state) => {
          // check if has connected
          const hasConnected =
            state.nodesById[nodeId].inputsConnectionByLabel[portLabel]

          if (hasConnected) {
            console.log("hasConnected")
            const oldConnection = state.connectionsById[hasConnected]
            const oldFromNode = state.nodesById[oldConnection.from.nodeId]
            // change oldFromNode output label connections
            oldFromNode.outputsConnectionsByLabel[
              oldConnection.from.outputLabel
            ] = oldFromNode.outputsConnectionsByLabel[
              oldConnection.from.outputLabel
            ].filter((cid) => cid !== hasConnected)
            // remove old connection from connectionsById
            delete state.connectionsById[hasConnected]
            state.connectionsOrder = state.connectionsOrder.filter(
              (id) => id !== hasConnected,
            )
          }

          // add connections to ...ConnectionsByLabel
          // fromNode
          state.nodesById[draftConnection.nodeId].outputsConnectionsByLabel[
            draftConnection.portLabel
          ].push(id)
          // toNode
          state.nodesById[nodeId].inputsConnectionByLabel[portLabel] = id

          state.connectionsById[id] = connection
          state.connectionsOrder.push(id)

          const queue = [id]
          while (queue.length !== 0) {
            const cid = queue.shift()
            if (!cid) break

            const connection = state.connectionsById[cid]
            const fromNode = state.nodesById[connection.from.nodeId]
            const toNode = state.nodesById[connection.to.nodeId]
            const toNodeDef = definedNodesByKey[toNode.key]

            // change `toNode` input value to `fromNode` output value of cid
            toNode.inputsValueByLabel[connection.to.inputLabel] =
              fromNode.outputsValueByLabel[connection.from.outputLabel]

            // re-compute toNode
            if (!toNodeDef.compute) break
            const oldOutputsValueByLabel = toNode.outputsValueByLabel
            toNode.outputsValueByLabel = toNodeDef.compute(
              toNode.inputsValueByLabel as PortByLabel<typeof toNodeDef.inputs>,
            )

            toNodeDef.outputs.forEach((output) => {
              // old output value !== new output value
              // add output cid to queue
              const toNodeOutputConnections =
                toNode.outputsConnectionsByLabel[output.label]
              if (
                oldOutputsValueByLabel[output.label] !==
                  toNode.outputsValueByLabel[output.label] &&
                toNodeOutputConnections.length !== 0
              ) {
                queue.push(...toNodeOutputConnections)
              }
            })
          }

          // re-compute toNode
          // while (queue.length === 0) {
          //   const targetId = queue.shift()

          //   if (!targetId) break

          //   const targetNode = state.nodesById[targetId]
          //   const definedNode = definedNodesByKey[targetNode.key]

          //   // update node value
          //   targetNode

          //   if (!definedNode.compute) break

          //   targetNode.outputsValueByLabel = definedNode.compute(
          //     targetNode.inputsValueByLabel as PortByLabel<
          //       typeof definedNode.inputs
          //     >,
          //   )

          //   definedNode.outputs.forEach((output) => {
          //     const outputConnections =
          //       targetNode.outputsConnectionsByLabel[output.label]

          //     if (outputConnections.length !== 0) {
          //       outputConnections.forEach((cid) => {
          //         queue.push(state.connectionsById[cid].to.nodeId)
          //       })
          //     }
          //   })
          // }

          // reset draftConnection
          state.draftConnection = null

          // add connection

          // return {
          //   draftConnection: null,
          //   connectionsById: { ...state.connectionsById, [id]: connection },
          //   connectionsOrder: [...state.connectionsOrder, id],
          // }
        })
      },
      cancelDraftConnection() {
        console.log("action cancelDraftConnection")
        set(() => {
          return { draftConnection: null }
        })
      },
      updateDraftConnectionCoord(mouseX, mouseY) {
        set((state) => {
          const oldDraftConnectioin = state.draftConnection
          if (!oldDraftConnectioin) return state

          const newDraftConnection = {
            ...oldDraftConnectioin,
            mouseX,
            mouseY,
          }
          return { draftConnection: newDraftConnection }
        })
      },
    })),
  )
}
