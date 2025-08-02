import Link from 'next/link'

import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import { ProjectStructure } from './sidebar/project-structure'

export default function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0b295e259b734d8bb96a58b78a9c499c%2F426a0a657c2340a2811200d88baf89e8?format=webp&width=800"
            alt="Momentum Creative Logo"
            className={cn('size-5 object-contain')}
          />
          <span className="font-semibold text-sm">Momentum Creative</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>New Concept</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex-1 overflow-y-auto">
          <ProjectStructure />
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
