import {
  HomeIcon,
  SquareTextIcon,
  SignpostIcon,
  SignpostBigIcon,
  ToolboxIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"

export const routeMap = {
  home: {
    href: "/",
    Icon: HomeIcon as LucideIcon,
    title: "主页",
  },
  blog: {
    href: "/blog",
    Icon: SquareTextIcon as LucideIcon,
    title: "博客",
  },
  // tutorial: {
  //   href: "/tutorial",
  //   Icon: SignpostIcon as LucideIcon,
  //   title: "教程",
  // },
  tool: {
    href: "/tool",
    Icon: ToolboxIcon as LucideIcon,
    title: "工具",
  },
  setting: {
    href: "/setting",
    Icon: SettingsIcon as LucideIcon,
    title: "设置",
  },
}

export const routes = Object.values(routeMap)
