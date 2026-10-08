import localFont from "next/font/local"
import { Geist, Geist_Mono, Noto_Sans, Noto_Sans_SC } from "next/font/google"
import { cn } from "cn"
import type { Metadata } from "next"

import "./globals.css"
import "katex/dist/katex.css"

import { TooltipProvider } from "@/components/ui/tooltip"
// import { Toaster } from "@/components/ui/toast"
import { TRPCProvider } from "@/trpc/client"
import { Layout } from "@/components/layout"
import { ProgressBarProvider } from "@/components/layout/progress-bar-provider"

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const firaCode = localFont({
  variable: "--font-fira-code",
  src: [
    {
      path: "./fonts/Fira_Code_v6.2/FiraCode-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Fira_Code_v6.2/FiraCode-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "./fonts/Fira_Code_v6.2/FiraCode-Bold.woff2",
      weight: "700",
      style: "bold",
    },
  ],
  display: "swap",
})

const mapleMono = localFont({
  variable: "--font-maple-mono",
  src: [
    {
      path: "./fonts/MapleMono/MapleMono-NF-CN-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        firaCode.variable,
        mapleMono.variable,
      )}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <ProgressBarProvider>
          <TRPCProvider>
            <TooltipProvider>
              <Layout>{children}</Layout>
            </TooltipProvider>
          </TRPCProvider>
        </ProgressBarProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "主页 - lorem314.io",
  description: "个人博客网站",
}
