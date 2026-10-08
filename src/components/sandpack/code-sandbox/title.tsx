export const Title = ({ title }: { title?: string }) => {
  return (
    <div className="rounded-t-lg border-b border-dashed">
      <div className="text-muted-foreground px-2.5 py-2.5 text-sm">
        {title || "代码沙盒"}
      </div>
    </div>
  )
}
