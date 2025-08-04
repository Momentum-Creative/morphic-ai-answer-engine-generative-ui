import Link from 'next/link'
import { User } from '@supabase/supabase-js'

import { Plus, Lightbulb, TrendingUp } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import { CreditsIndicator } from './credits-indicator'
import { GlobalTodoSection } from './sidebar/global-todo-section'
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
        <div className="px-2 py-4 space-y-3">
          <SidebarMenu className="space-y-3">
            <SidebarMenuItem>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <Plus className="size-4 group-hover:scale-110 transition-transform duration-200" />
                <span>New Concept</span>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link
                href="/inspiration"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <Lightbulb className="size-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Inspiration</span>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link
                href="/trends"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <TrendingUp className="size-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Trends</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* To Do Section */}
        <div className="px-2 py-3 border-t border-border/30">
          <GlobalTodoSection />
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <ProjectStructure />
        </div>
      </SidebarContent>
      <SidebarFooter className="px-2 py-3 border-t border-border/50">
        <CreditsIndicator />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
