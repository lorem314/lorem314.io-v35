import Link from "next/link"
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

export default function Home() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>工具</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Item variant="outline" asChild>
          <Link href="/tool/node-system">
            <ItemContent>
              <ItemTitle>节点系统</ItemTitle>
              <ItemDescription className="line-clamp-none">
                可进行加减乘除运算的简易节点系统，右键唤出菜单栏后可选择节点添加，点击节点出口后再点击节点入口进行连接。暂未实现删除节点和连线功能，可刷新页面重置。同节点出口连接入口后自动取消，暂未检查多节点循环连接，请勿尝试。
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
      </CardContent>
    </Card>
  )
}
