'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Building2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserProfileSectionProps {
  user?: User | null
  userType?: 'brand' | 'creator' | null
}

export function UserProfileSection({ user, userType }: UserProfileSectionProps) {
  const [currentUserType, setCurrentUserType] = useState<'brand' | 'creator'>('creator')

  // Handle client-side localStorage access after hydration
  useEffect(() => {
    if (userType) {
      setCurrentUserType(userType)
    } else {
      const storedUserType = localStorage.getItem('user-type') as 'brand' | 'creator' | null
      setCurrentUserType(storedUserType || 'creator')
    }
  }, [userType])

  // Mock data for demonstration - in real app this would come from user data
  const profileData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kareem',
    company: currentUserType === 'brand' ? 'Momentum Creative' : undefined,
    avatar: user?.user_metadata?.avatar_url || '',
    initials: user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'K'
  }

  return (
    <div className="px-3 py-4 border-b border-border/50" suppressHydrationWarning>
      <div className="flex items-center gap-3">
        {/* Profile Avatar */}
        <Avatar className="h-10 w-10">
          <AvatarImage src={profileData.avatar} alt={profileData.name} />
          <AvatarFallback className={cn(
            "text-sm font-medium",
            currentUserType === 'brand'
              ? "bg-blue-500 text-white"
              : "bg-purple-500 text-white"
          )}>
            {profileData.initials}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground truncate">
              {profileData.name}
            </p>
            <div className="h-3 w-3 flex-shrink-0">
              {currentUserType === 'brand' && (
                <Building2 className="h-3 w-3 text-blue-500" />
              )}
            </div>
          </div>
          
          {profileData.company && (
            <p className="text-xs text-muted-foreground truncate">
              {profileData.company}
            </p>
          )}
          
          <div className="flex items-center gap-1 mt-1" suppressHydrationWarning>
            <div className={cn(
              "h-2 w-2 rounded-full",
              currentUserType === 'brand' ? "bg-blue-500" : "bg-purple-500"
            )} />
            <span className="text-xs text-muted-foreground capitalize">
              {currentUserType}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
