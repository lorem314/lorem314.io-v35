import "dotenv/config"

import { client } from "@/lib/elastic"

async function main() {
  const clientInfo = await client.info()
  console.log("client info:", clientInfo)
}

main().catch((error) => {
  console.log("[src/scripts/es-test.mjs] error:")
  console.error(error)
})
