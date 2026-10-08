import "dotenv/config"
import { client } from "@/lib/elastic"
import { register } from "node:module"
register("fumadocs-mdx/node/loader", import.meta.url)

const INDEX_NAME = "lorem314.io-v35"

async function main() {
  const { blogSource } = await import("../lib/source.ts")
  const blogPages = blogSource.getPages()
  // console.log("blogPages.length", blogPages.length)

  // console.log("blogPages[0]", blogPages[0])

  const isBlogIndexExists = await client.indices.exists({
    index: `${INDEX_NAME}_blog`,
  })
  console.log("isBlogIndexExists", isBlogIndexExists)

  if (!isBlogIndexExists) {
    // create index
    const createIndexResult = await client.indices.create({
      index: `${INDEX_NAME}_blog`,
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
        "index.max_ngram_diff": 10,
        analysis: {
          analyzer: {
            ik_max_word_analyzer: {
              type: "custom",
              tokenizer: "ik_max_word",
              filter: ["lowercase"],
            },
            ik_smart_analyzer: {
              type: "custom",
              tokenizer: "ik_smart",
              filter: ["lowercase"],
            },
            ngram_analyzer: {
              type: "custom",
              tokenizer: "ik_smart",
              filter: ["lowercase", "edge_ngram_filter"],
            },
          },
          filter: {
            edge_ngram_filter: {
              type: "edge_ngram",
              min_gram: 1, // 从 2 开始，避免单字符碎片
              max_gram: 8,
            },
          },
        },
      },
      mappings: {
        properties: {
          url: { type: "keyword", index: false, doc_values: false },
          contentType: { type: "keyword", index: false, doc_values: false },
          title: {
            type: "text",
            analyzer: "ik_smart_analyzer",
            search_analyzer: "ik_smart_analyzer",
            fields: {
              ngram: {
                type: "text",
                analyzer: "ngram_analyzer",
                search_analyzer: "ik_smart_analyzer",
              },
            },
          },
          tags: { type: "keyword" },
          createdAt: { type: "date", index: false },
          description: {
            type: "text",
            analyzer: "ik_max_word_analyzer",
            search_analyzer: "ik_smart_analyzer",
            fields: {
              ngram: {
                type: "text",
                analyzer: "ngram_analyzer",
                search_analyzer: "ik_smart_analyzer",
              },
            },
          },
          structuredContents: {
            type: "nested",
            properties: {
              heading: { type: "keyword", index: false, doc_values: false },
              content: {
                type: "text",
                analyzer: "ik_max_word_analyzer",
                search_analyzer: "ik_smart_analyzer",
                fields: {
                  ngram: {
                    type: "text",
                    analyzer: "ngram_analyzer",
                    search_analyzer: "ik_smart_analyzer",
                  },
                },
              },
            },
          },
        },
      },
    })
    console.log("createIndexResult", createIndexResult)
  }

  // bulk
  const bulkResult = await client.helpers.bulk({
    index: `${INDEX_NAME}_blog`,
    refresh: true,
    datasource: blogPages.map((blogPage) => {
      return {
        url: blogPage.url,
        contentType: blogPage.data.articleType,
        title: blogPage.data.title,
        tags: blogPage.data.tags,
        createdAt: blogPage.data.createdAt,
        description: blogPage.data.description,
        structuredContents: blogPage.data.structuredData.contents,
      }
    }),
    onDocument: (blogPage) => {
      return {
        index: {
          _id: blogPage.url,
        },
      }
    },
  })
  console.log("bulkResult", bulkResult)
}

main().catch((error) => {
  console.log("[src/scripts/build-es-index.mjs]: Catch error")
  console.error(error)
})
