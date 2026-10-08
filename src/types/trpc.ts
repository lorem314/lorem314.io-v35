import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/trpc/routers"

export type RouterOutput = inferRouterOutputs<AppRouter>
