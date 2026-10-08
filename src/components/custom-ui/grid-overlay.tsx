export function GridOverlay({
  size = 24,
  offsetX = Math.floor(Math.random() * size),
  offsetY = Math.floor(Math.random() * size),
  color = "#80808012",
}: {
  size?: number
  offsetX?: number
  offsetY?: number
  color?: string
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
      }}
    />
  )
}
