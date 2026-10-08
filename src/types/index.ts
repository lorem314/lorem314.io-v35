import z from "zod"

import { blogFrontmatter } from "@/data/blog-frontmatter"

export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type Theme = "light" | "dark"
export type PreferredTheme = Theme | "system"

type BlogFrontmatter = z.infer<typeof blogFrontmatter>
export type BlogItem = Prettify<{ id: string; url: string } & BlogFrontmatter>

export type CountedTag = { name: string; count: number }

export type CodeHikeTheme =
  | "dark-plus"
  | "dracula-soft"
  | "dracula"
  | "github-dark"
  | "github-dark-dimmed"
  | "github-light"
  | "light-plus"
  | "material-darker"
  | "material-default"
  | "material-lighter"
  | "material-ocean"
  | "material-palenight"
  | "min-dark"
  | "min-light"
  | "monokai"
  | "nord"
  | "one-dark-pro"
  | "poimandres"
  | "slack-dark"
  | "slack-ochin"
  | "solarized-dark"
  | "solarized-light"
