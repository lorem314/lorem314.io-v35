"use client"

import { ProgressProvider } from "@bprogress/next/app"

export function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Sky 500 #0ea5e9 标准主色，最协调
  // Sky 600 #0284c7 更深一点，更稳重
  // Sky 400 #38bdf8 更亮、更活泼
  // Indigo 500 #6366f1 想和图标颜色完全统一时用
  return (
    <ProgressProvider
      height="4px"
      color="#0ea5e9"
      options={{ showSpinner: false }}
      shallowRouting
      // delay={0}
      // startPosition={0.3}
    >
      {children}
    </ProgressProvider>
  )
}
