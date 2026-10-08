import { z } from "zod"

export const blogFrontmatter = z.object({
  slug: z.string().optional(),
  articleType: z.string().optional().default("blog"),
  title: z.string(),
  createdAt: z.coerce.date(),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  cover: z.string().optional().default("/image/blog/default-cover.webp"),
  bvid: z.string().optional().default(""),
  stats: z
    .object({
      wordCount: z.number(),
      codeBlockCount: z.number(),
      imageCount: z.number(),
    })
    .optional(),
})
