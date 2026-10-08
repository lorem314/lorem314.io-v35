import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { cn } from "cn"

import { routes } from "@/data/routes"

export const Sidebar = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  return (
    <nav className="flex h-full">
      <ul
        className={cn(
          "bg-secondary/50 flex basis-16 flex-col border-r border-dashed",
          "shrink-0 items-center gap-4 overflow-y-hidden pt-4",
          "",
        )}
      >
        {routes.map((route, index) => {
          return (
            <li key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                    )}
                    onClick={closeDrawer}
                  >
                    <route.Icon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {route.title}
                </TooltipContent>
              </Tooltip>
            </li>
          )
        })}
      </ul>

      <section
        className={cn(
          "grow overflow-hidden shadow",
          "bg-card/60 border-muted mx-4 mt-4 rounded-t-lg border",
          "dark:border dark:border-dashed",
        )}
      >
        <div className="no-scrollbar scroll-fade-y h-full overflow-y-auto">
          <div className="text-muted-foreground mt-4 text-center text-sm">
            这里暂时还没有内容...
          </div>
          {/* <div className="prose dark:prose-invert">
            <ul>
              {Array(10)
                .fill(null)
                .map((_, index) => {
                  return (
                    <li key={index}>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Fugiat laboriosam aliquid ullam? Aliquam quos itaque
                        recusandae iste eveniet amet quaerat doloremque quisquam
                        ad at, molestiae est perspiciatis nesciunt adipisci
                        velit illum ullam delectus dolore temporibus architecto
                        quo excepturi veniam distinctio. Nam, harum.
                      </p>
                    </li>
                  )
                })}
            </ul>
          </div> */}
        </div>
      </section>
    </nav>
  )
}
