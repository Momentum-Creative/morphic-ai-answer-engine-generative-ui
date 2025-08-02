'use client'

import { useState, useEffect } from 'react'
import { Folder, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

interface ProjectIndicatorProps {
  className?: string
  conceptProgress?: number // 0-100, tracks how much of the concept is filled
}

export function ProjectIndicator({ className, conceptProgress = 0 }: ProjectIndicatorProps) {
  const [selectedProject, setSelectedProject] = useState('My First Project')
  const [conceptName, setConceptName] = useState('')
  const [isGeneratingName, setIsGeneratingName] = useState(false)
  const [availableProjects] = useState([
    'My First Project',
    'Brand Campaign 2024',
    'Product Launch Video'
  ])

  const generateConceptName = () => {
    setIsGeneratingName(true)
    // Simulate LLM generation
    setTimeout(() => {
      const conceptNames = [
        'Dynamic Brand Showcase',
        'Emotional Connection Campaign',
        'Bold Innovation Story',
        'Authentic Voice Journey',
        'Transformative Experience'
      ]
      const randomName = conceptNames[Math.floor(Math.random() * conceptNames.length)]
      setConceptName(randomName)
      setIsGeneratingName(false)
    }, 2000)
  }

  return (
    <div className={cn('flex flex-col items-center mb-6', className)}>
      {/* Concept Name Display */}
      {conceptName && (
        <div className="mb-3 text-center">
          <h2 className="text-xl font-bold text-foreground mb-1">"{conceptName}"</h2>
          <p className="text-xs text-muted-foreground">AI-Generated Concept Name</p>
        </div>
      )}

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
            {availableProjects.map(project => (
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

        {/* Generate Concept Name Button */}
        {!conceptName && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateConceptName}
            disabled={isGeneratingName}
            className="ml-2 h-7 text-xs"
          >
            {isGeneratingName ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
                Generating...
              </>
            ) : (
              'Generate Name'
            )}
          </Button>
        )}
      </div>

      {/* Regenerate option for existing concept name */}
      {conceptName && (
        <Button
          variant="ghost"
          size="sm"
          onClick={generateConceptName}
          disabled={isGeneratingName}
          className="mt-2 h-6 text-xs text-muted-foreground hover:text-foreground"
        >
          {isGeneratingName ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
              Regenerating...
            </>
          ) : (
            'Regenerate Name'
          )}
        </Button>
      )}
    </div>
  )
}
