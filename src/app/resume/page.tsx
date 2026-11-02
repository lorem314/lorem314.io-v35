import {
  PhoneIcon,
  MapPinIcon,
  GraduationCapIcon,
  ComponentIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { GithubIcon, BilibiliIcon } from "@/components/icon/brand"
import { ExternalLink } from "@/components/custom-ui/external-link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const personalInfo = {
  name: "党子寅",
  title: "React 全栈开发工程师",
  contact: {
    phone: { icon: PhoneIcon, content: "13810104237" },
    address: { icon: MapPinIcon, content: "北京 - 朝阳 - 常营（6 号线）" },
  },
  social: {
    github: { icon: GithubIcon, link: "https://github.com/lorem314" },
    bilibili: {
      icon: BilibiliIcon,
      link: "https://space.bilibili.com/7909744",
    },
  },
  avatar: "/image/avatar.webp",
  bios: [
    "热爱技术的全栈工程师，喜欢开源，持续学习新技术，追求代码质量与用户体验。",
    "专攻 React 技术栈。擅长用 NextJS 框架，配合 better-auth 鉴权、zustand 管理状态、drizzle 连接数据库、tanstack-form 管理表单，来进行支持服务端渲染的全栈开发。",
    "熟练使用 Git、阅读英文文档。爱好沙盒类游戏，平时喜欢看美剧、电子板绘和用 Blender 做 3D 建模。",
  ],
  education: {
    school: "北京工业大学（211）",
    major: "计算机科学与技术（本科 - 4 年制）",
    period: "2014 年 9 月 - 2018 年 7 月",
    description:
      "主修高数、数据结构、操作系统和计算机网络等课程。网络部部员，负责管理校园网论坛软件板块。大二上学期末随全班前往法国进行为期 1 个月的学习体验。",
  },
}

const personalProjects = [
  {
    name: "个人博客网站（该网站）",
    description:
      "用 NextJS 构建的个人博客网站，用于记录平时的笔记和发布教程。支持夜间模式；用 Fumadocs 处理 MDX 内容；用 Elasticsearch 构建索引，支持全文搜索；用 Sandpack 构建页面实时可编辑代码沙盒；用 tRPC 实现前后端通信。通过 PM2 和 Nginx 部署。",
    tech: [
      "React",
      "Next.js",
      "Typescript",
      "Shadcn",
      "Fumadocs",
      "CodeHike",
      "Tailwind CSS",
      "tRPC",
      "TanStack",
      "Elasticsearch",
      "Sandpack",
      "Zustand",
    ],
    links: [
      {
        href: "https://github.com/lorem314/lorem314.io-v35",
        title: "Github",
        isExternal: true,
      },
    ],
  },
  {
    name: "类 DeepSeek AI 聊天网站",
    description:
      "基于 Next.js 构建的类 DeepSeek / Grok AI 聊天应用。使用 @ai-sdk/react、@ai-sdk/openai-compatible 等实现流式对话；通过 Drizzle + PostgreSQL 持久化用户聊天记录；结合 Redis 与 resumable-stream 支持断线重连并恢复数据流；界面主要使用 shadcn/ui 中的 MessageScroll 组件 + Tailwind CSS。",
    tech: [
      "React",
      "Next.js",
      "Typescript",
      "Shadcn",
      "@ai-sdk/openai-compatible",
      "@ai-sdk/react",
      "redis",
      "resumable-stream",
      "Drizzle ORM",
    ],
    links: [
      {
        href: "https://github.com/lorem314/next-social-v3",
        title: "Github",
        isExternal: true,
      },
    ],
  },
  {
    name: "社交应用网站",
    description:
      "基于 Next.js + TypeScript + Tailwind CSS 构建的社交应用。支持用户注册登录、个人信息编辑、相互关注、发布动态与点赞等功能。采用 accessToken + refreshToken 实现安全鉴权与持久化登录；后端使用 tRPC + Drizzle，配合 TypeScript 保证前端、后端和数据库中的类型一致；前端通过 TanStack Query 实现乐观更新，界面基于 shadcn/ui。",
    tech: [
      "React",
      "Next.js",
      "TypeScript",
      "Shadcn",
      "tRPC",
      "Drizzle",
      "TanStack",
    ],
    links: [
      {
        href: "https://github.com/lorem314/next-social-v2",
        title: "Github",
        isExternal: true,
      },
    ],
  },
  {
    name: "节点式计算器",
    description:
      "受 ComfyUI 中的可视化节点系统启发，用 Zustand 管理状态，在 NextJS 中实现的基于节点的可视化计算器。可通过自定义节点支持字符串等其他 JS 中的逻辑运算。目前正在研发第 3 版，打算支持异步运算和节点错误重算。",
    tech: ["zustand", "nextjs"],
    links: [
      {
        href: "/tool",
        title: "在线展示",
        isExternal: false,
      },
    ],
  },
]

const workExperiences = [
  {
    company: "自由职业",
    position: "",
    period: "2025 年 8 月 30 日 - 至今",
    location: "北京",
    description:
      "持续跟进 React 相关最新动向。学习了 ComfyUI、LM Studio 等本地私有化部署 AI 软件、Godot 开源游戏引擎、Pixel Composer 软件、ComfyUI 中的图片生成、声音克隆等工作流。目前在探索通过 NodeJS 访问 ComfyUI API 实现自动化控制。",
  },
  {
    company: "北京美大国际旅行社有限公司",
    position: "React 前端开发",
    period: "2025 年 5 月 19 日 - 2025 年 8 月 29 日",
    location: "北京",
    description:
      "负责修改用 AI 生成的、基于 Vite 框架的 React 多个项目。为多个项目添加酒店相关的搜索、选房、预定等功能，用户注册、登录、查看订单等功能。",
  },
  {
    company: "北京智润天成节能设备有限公司",
    position: "前端开发",
    period: "2024 年 12 月 2 日 - 2025 年 5 月 16 日",
    location: "北京",
    description:
      "负责编写微信小程序；用 NextJS 编写前端页面，实现用户登录和数据的增删改查，UI 使用 MaterialUI。用 Nginx 和 PM2 在 CentOS 服务器上部署。也写过一些 Java Spring Boot 和 MySQL 语句。",
  },
  {
    company: "兼职",
    position: "数学·英语 家教",
    period: "毕业后 - 2024 年 3 月",
    location: "河北 · 唐山 · 迁安",
    description:
      "毕业后本打算去日本留学，备考日语和英语等级考试，在 Coursera 网站学习机器学习相关课程，撰写研究计划，最终由名古屋工业大学酒井教授研究室决定接收，研究方向为：基于机器学习的推荐系统设计，继续备考考试。之后由于疫情，再留证明未能按时发放。期间打过零工：在快递站帮忙，和教初高中学生数学和英语。",
  },
]

export default function Page() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 个人信息 */}
        <PersonalInfo />

        <Separator className="mb-10" />

        <Education edu={personalInfo.education} />

        <PersonalProjects />

        <WorkExperience />

        <Certificates />
      </div>
    </div>
  )
}

const PersonalInfo = () => {
  return (
    <section className="mb-12">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="border-border h-24 w-24 border-2">
          <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
          <AvatarFallback className="text-2xl">
            {personalInfo.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {personalInfo.name}
          </h2>

          <h3 className="text-muted-foreground text-lg">
            {personalInfo.title}
          </h3>

          {/* 联系方式 */}
          <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {Object.entries(personalInfo.contact).map(([key, value]) => {
              return (
                <span key={key} className="flex items-center gap-1.5">
                  <value.icon className="h-4 w-4" />
                  {value.content}
                </span>
              )
            })}
          </div>

          {/* 社交帐号 */}
          <div className="flex gap-2 pt-1">
            {Object.entries(personalInfo.social).map(([key, value]) => {
              return (
                <Button key={key} variant="outline" size="sm" asChild>
                  <a
                    href={value.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <value.icon className="h-4 w-4" />
                    {key}
                    <ExternalLinkIcon />
                  </a>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mt-6 leading-relaxed">
        {personalInfo.bios.map((bio, key) => {
          return (
            <p key={key} className="mb-2">
              {bio}
            </p>
          )
        })}
      </div>
    </section>
  )
}

const Education = ({ edu }: { edu: (typeof personalInfo)["education"] }) => {
  return (
    <section className="mb-12">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <GraduationCapIcon className="h-5 w-5" />
        教育经历
      </h2>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg">{edu.school}</CardTitle>
              <CardDescription className="mt-1 text-base">
                {edu.major}
              </CardDescription>
            </div>
            <div className="text-muted-foreground text-sm">{edu.period}</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{edu.description}</p>
        </CardContent>
      </Card>
    </section>
  )
}

const PersonalProjects = () => {
  return (
    <section className="mb-12">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <ComponentIcon className="h-5 w-5" />
        个人项目
      </h2>
      <div className="grid gap-6">
        {personalProjects.map((project, index) => {
          return (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="mb-2 text-base">{project.name}</CardTitle>
                <CardDescription className="line-clamp-none">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                {project.links ? (
                  <div>
                    {project.links.map((link, index) => {
                      return (
                        <span key={index}>
                          {link.isExternal ? (
                            <ExternalLink href={link.href}>
                              {link.title}
                            </ExternalLink>
                          ) : (
                            <Link
                              className="text-link-foreground hover:underline"
                              href={link.href}
                            >
                              {link.title}
                            </Link>
                          )}
                        </span>
                      )
                    })}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-x-1.5 gap-y-2.5">
                  {project.tech.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

const WorkExperience = () => {
  return (
    <section className="mb-12">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <BriefcaseIcon className="h-5 w-5" />
        工作经历
      </h3>
      <div className="space-y-6">
        {workExperiences.map((job, index) => {
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.position}</CardTitle>
                    <CardDescription className="text-foreground mt-1 text-base font-medium">
                      {job.company}
                    </CardDescription>
                  </div>
                  <div className="text-muted-foreground text-sm sm:text-right">
                    <div>{job.period}</div>
                    <div>{job.location}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

const Certificates = () => {
  return (
    <section className="mb-12">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <ShieldCheckIcon className="h-5 w-5" />
        证书
      </h3>
      <ItemGroup className="">
        {[
          { title: "日语 N1", score: "112 / 180" },
          { title: "英语 TOEIC", score: "845 / 990" },
          {
            title: "Coursera 深度学习 结业证明",
            link: "https://www.coursera.org/account/accomplishments/specialization/UV4T76MU9Q29",
          },
        ].map((cert, index) => {
          return (
            <Item variant="outline" key={index}>
              <ItemContent>
                <ItemTitle className="w-full justify-between">
                  <span>{cert.title}</span>
                  {cert.score && <span>{cert.score}</span>}
                  {cert.link && (
                    <ExternalLink href={cert.link}>链接</ExternalLink>
                  )}
                </ItemTitle>
              </ItemContent>
            </Item>
          )
        })}
      </ItemGroup>
    </section>
  )
}
