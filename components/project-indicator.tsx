'use client'

import { useState, useEffect } from 'react'
import { Folder, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface ProjectIndicatorProps {
  className?: string
}

export function ProjectIndicator({ className }: ProjectIndicatorProps) {
  const [selectedProject, setSelectedProject] = useState('My First Project')
  const [availableProjects] = useState([
    'My First Project',
    'Brand Campaign 2024',
    'Product Launch Video'
  ])

  return (
    <div className={cn('flex flex-col items-center mb-6', className)}>
      {/* Project Association Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full border border-border/50 backdrop-blur-sm">
        <Folder className="h-4 w-4 text-blue-500" />
        <span className="text-sm text-muted-foreground">Concept for:</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-medium text-foreground hover:bg-transparent"
            >
              {selectedProject}
              <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-[200px]">
            {availableProjects.map((project) => (
              <DropdownMenuItem
                key={project}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  'cursor-pointer',
                  selectedProject === project && 'bg-accent'
                )}
              >
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
                {project}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
