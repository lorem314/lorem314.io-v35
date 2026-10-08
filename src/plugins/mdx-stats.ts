import type { Plugin } from "unified"
import { visit } from "unist-util-visit"
import type { Node } from "unist"
import type { VFile } from "vfile"

const cjkRegex =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu

export const mdxStats: Plugin = () => {
  return (tree: Node, file: VFile) => {
    let wordCount = 0
    let codeBlockCount = 0
    let imageCount = 0

    visit(tree, "text", (node: any) => {
      const text = (node.value || "").trim()
      if (!text) return

      // 中文/日韩字符每个算 1
      const cjkCount = (text.match(cjkRegex) || []).length

      // 去掉 CJK 后统计英文单词（标点自动被 \b 忽略）
      const nonCjkText = text.replace(cjkRegex, " ")
      const englishWords = (nonCjkText.match(/\b[\p{L}\p{N}']+\b/gu) || [])
        .length

      wordCount += cjkCount + englishWords
    })

    visit(tree, "image", () => {
      imageCount++
    })

    visit(tree, "mdxJsxFlowElement", (node: any) => {
      switch (node.name) {
        case "MdxImage":
          imageCount++
          break

        case "CodeHikePre":
        case "CodeViewer":
        case "CodeWithTabs":
        case "NpmTabs":
          codeBlockCount++
          break

        default:
          break
      }
    })

    const frontmatter = (file.data.frontmatter as any) || {}
    file.data.frontmatter = {
      ...frontmatter,
      stats: {
        wordCount,
        codeBlockCount,
        imageCount,
      },
    }
  }
}
