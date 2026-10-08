import { Search } from "@/features/blog/components/search"
import { Select } from "@/features/blog/components/select"
import { List } from "@/features/blog/components/list"

import { cn } from "cn"

export default function Page() {
  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-12 gap-6">
      <div className="col-span-full lg:col-span-6">
        <Search />
      </div>
      <div className="col-span-full lg:col-span-6">
        <Select />
      </div>
      <div
        className={cn(
          "col-span-full 2xl:col-span-8",
          true ? "2xl:col-span-full" : "",
        )}
      >
        <List />
      </div>
    </div>
  )
}
