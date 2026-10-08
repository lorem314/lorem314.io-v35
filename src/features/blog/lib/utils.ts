import { BlogItem } from "@/types"

export const getAllBlogsTagCountMap = (blogs: BlogItem[]) => {
  const map = new Map<string, number>()

  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      const currentCount = map.get(tag) || 0
      map.set(tag, currentCount + 1)
    })
  })

  return map
}

export const filterBlogs = (
  blogs: BlogItem[],
  filter: {
    search: string
    selectedTags: string[]
    tagFilterLogic: "OR" | "AND"
  },
) => {
  const { search, selectedTags, tagFilterLogic } = filter
  const hasTags = selectedTags.length > 0

  const trimmedSearch = search.trim()

  const matchedBlogs = blogs.filter((blog) => {
    if (
      trimmedSearch !== "" &&
      !blog.title.includes(search) &&
      !blog.description.includes(search)
    )
      return false

    if (!hasTags) return true

    switch (tagFilterLogic) {
      case "OR":
        return selectedTags.some((tag) => blog.tags.includes(tag))
      case "AND":
        return selectedTags.every((tag) => blog.tags.includes(tag))
      default:
        return true
    }
  })

  return matchedBlogs
}

export const recycleRange = (
  number: number,
  offset: number,
  [min, max]: [number, number],
): number => {
  // 1. 计算区间内总共有多少个整数
  const span = max - min + 1

  // 2. 将当前位置归零化，并加上偏移量
  const target = number - min + offset

  // 3. 核心：通过两次取模，彻底解决 JavaScript 中负数取余仍为负数的问题
  // 这样无论 offset 是 -100 还是 10000，都能一次性定位到最终的 0 到 span-1 之间的位置
  const shifted = ((target % span) + span) % span

  // 4. 将结果还原回原区间
  return min + shifted
}
