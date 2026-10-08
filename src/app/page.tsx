import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>主页</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div>欢迎来到我的博客</div>
      </CardContent>
    </Card>
  )
}
