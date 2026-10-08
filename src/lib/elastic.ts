import { Client } from "@elastic/elasticsearch"

// import { isDev } from "./env"

const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE
// const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME
// const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD

// if (!isDev) {
//   if (!ELASTICSEARCH_NODE) {
//     throw new Error("环境变量 ELASTICSEARCH_NODE 未设置")
//   }
//   if (!ELASTICSEARCH_USERNAME) {
//     throw new Error("环境变量 ELASTICSEARCH_USERNAME 未设置")
//   }
//   if (!ELASTICSEARCH_PASSWORD) {
//     throw new Error("环境变量 ELASTICSEARCH_PASSWORD 未设置")
//   }
// }

const client = new Client({
  node: ELASTICSEARCH_NODE,
  // auth: isDev
  //   ? undefined
  //   : {
  //       username: ELASTICSEARCH_USERNAME!,
  //       password: ELASTICSEARCH_PASSWORD!,
  //     },
})

export { client }
