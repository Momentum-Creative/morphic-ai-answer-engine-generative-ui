import Link from 'next/link'
import { User } from '@supabase/supabase-js'

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
import { UserProfileSection } from './sidebar/user-profile-section'

interface AppSidebarProps {
  user?: User | null
}

export default function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center px-2 py-3">
        <UserProfileSection user={user} compact />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <div className="px-2 py-4">
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
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          <ProjectStructure />
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
