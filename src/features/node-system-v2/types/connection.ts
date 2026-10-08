export type Connection = {
  id: string
  from: {
    nodeId: string
    outputLabel: string
  }
  to: {
    nodeId: string
    inputLabel: string
  }
}
