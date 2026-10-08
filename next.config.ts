import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  reactCompiler: true,

  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["192.168.1.2"],
  }),

  redirects: () => [
    {
      source: `/blog/${encodeURIComponent("用-react-和-ts-编写抽屉组件")}`,
      destination: "/blog/building-drawer-component-with-react-ts",
      permanent: true,
    },
    {
      source: `/blog/${encodeURIComponent("用-react-和-ts-编写可折叠树状列表组件")}`,
      destination:
        "/blog/building-collapsible-tree-list-component-with-react-ts",
      permanent: true,
    },
    {
      source: `/blog/${encodeURIComponent("用-react-和-shadcn-实现多选组件")}`,
      destination:
        "/blog/building-multi-select-component-with-shadcn-in-nextjs",
      permanent: true,
    },
    {
      source: `/blog/${encodeURIComponent("用-shadcn-和-ai-sdk-在-nextjs-中实现简易-ai-聊天页面")}`,
      destination: "/blog/building-simple-ai-chat-with-nextjs-and-ai-sdk",
      permanent: true,
    },
  ],
}

const withMDX = createMDX()

export default withMDX(nextConfig)
