import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import z from "zod"

import { createTRPCRouter } from "../init"
import { publicProcedure } from "../init"

import { client as esClient } from "@/lib/elastic"

type GlobalSearchResult = {
  url: string
  title: string
  tags: string[]
  createdAt: Date
  description: string
  structuredContents?: Array<{
    heading: string
    content: string
  }>
}

export const appRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return { message: "hello", time: new Date() }
  }),
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async (opts) => {
      const { input } = opts
      const { query } = input

      const searchResult = await esClient.search<GlobalSearchResult>({
        index: "lorem314.io-v35_blog",
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: ["title", "title.ngram"],
                },
              },
              {
                multi_match: {
                  query,
                  fields: ["description", "description.ngram"],
                },
              },
              {
                nested: {
                  path: "structuredContents",
                  query: {
                    multi_match: {
                      query,
                      fields: [
                        "structuredContents.content",
                        "structuredContents.content.ngram",
                      ],
                    },
                  },
                  inner_hits: {
                    name: "structuredContents",
                    size: 5,
                    _source: [
                      "structuredContents.heading",
                      "structuredContents.content",
                    ],
                    highlight: {
                      pre_tags: ["<mark>"],
                      post_tags: ["</mark>"],
                      fields: {
                        "structuredContents.content.ngram": {
                          number_of_fragments: 1,
                          fragment_size: 512,
                        },
                      },
                    },
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        _source: ["url", "title", "tags", "createdAt", "description"],
        highlight: {
          pre_tags: ["<mark>"],
          post_tags: ["</mark>"],
          fields: {
            "title.ngram": { fragment_size: 64, number_of_fragments: 1 },
            "description.ngram": { fragment_size: 256, number_of_fragments: 1 },
          },
        },
      })

      const hitsTotal = searchResult.hits.total

      // console.log("raw highlight", JSON.stringify(searchResult, null, 2))

      return {
        took: searchResult.took,
        hits: {
          total: {
            value: typeof hitsTotal === "object" ? hitsTotal.value : hitsTotal,
          },
          hits: searchResult.hits.hits
            .map((hit) => {
              const hitSource = hit._source
              const structuredContentsHit =
                hit.inner_hits?.["structuredContents"].hits

              if (!hit._id || !hitSource?.title) return null

              return {
                index: hit._index,
                id: hit._id,
                score: hit._score,
                source: {
                  url: hitSource?.url,
                  title: hitSource?.title,
                  description: hitSource?.description,
                  tags: hitSource?.tags,
                  createdAt: hitSource?.createdAt,
                },
                highlight: {
                  title: hit.highlight?.["title.ngram"]?.[0],
                  description: hit.highlight?.["description.ngram"]?.[0],
                },
                innerHits: {
                  structuredContents: {
                    hits: {
                      total: {
                        value:
                          typeof structuredContentsHit?.total === "object"
                            ? structuredContentsHit?.total.value
                            : structuredContentsHit?.total,
                      },
                      hits: structuredContentsHit?.hits
                        .map((hit) => {
                          const source = hit._source as {
                            heading: string
                            content: string
                          }

                          if (!source.heading) return null

                          return {
                            source: {
                              heading: source.heading,
                              content: source.content,
                            },
                            highlight: {
                              content:
                                hit.highlight?.[
                                  "structuredContents.content.ngram"
                                ]?.[0],
                            },
                          }
                        })
                        .filter((item) => item !== null),
                    },
                  },
                },
              }
            })
            .filter((item) => item !== null),
        },
      }
    }),
})

export type AppRouter = typeof appRouter

export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
