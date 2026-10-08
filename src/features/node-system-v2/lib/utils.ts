export const generateId = (): string => {
  return (
    "node_" +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 9)
  )
}
