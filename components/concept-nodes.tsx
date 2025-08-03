'use client'

import { useState } from 'react'
import {
  Building2,
  TrendingUp,
  Palette,
  BookOpen,
  Lightbulb,
  FileText,
  Brush,
  Monitor,
  ClipboardList
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useConceptContext } from './concept-context'

interface ConceptNode {
  id: string
  name: string
  shortName: string
  icon: React.ComponentType<any>
  color: string
  description: string
}

const conceptNodes: ConceptNode[] = [
  {
    id: 'brand',
    name: 'Brand',
    shortName: 'B',
    icon: Building2,
    color: 'text-blue-500',
    description: 'Brand guidelines and identity'
  },
  {
    id: 'trend',
    name: 'Trend',
    shortName: 'T',
    icon: TrendingUp,
    color: 'text-green-500',
    description: 'Current trends and insights'
  },
  {
    id: 'tone',
    name: 'Tone',
    shortName: 'To',
    icon: Palette,
    color: 'text-purple-500',
    description: 'Voice and tone direction'
  },
  {
    id: 'references',
    name: 'References',
    shortName: 'R',
    icon: BookOpen,
    color: 'text-orange-500',
    description: 'Reference materials'
  },
  {
    id: 'inspo',
    name: 'Inspo',
    shortName: 'I',
    icon: Lightbulb,
    color: 'text-yellow-500',
    description: 'Creative inspiration'
  },
  {
    id: 'story',
    name: 'Story',
    shortName: 'S',
    icon: FileText,
    color: 'text-red-500',
    description: 'Narrative structure'
  },
  {
    id: 'style',
    name: 'Style',
    shortName: 'St',
    icon: Brush,
    color: 'text-pink-500',
    description: 'Visual style guide'
  },
  {
    id: 'platform',
    name: 'Platform',
    shortName: 'P',
    icon: Monitor,
    color: 'text-indigo-500',
    description: 'Platform specifications'
  },
  {
    id: 'production',
    name: 'Production Guide',
    shortName: 'PG',
    icon: ClipboardList,
    color: 'text-teal-500',
    description: 'Production requirements'
  }
]

export function ConceptNodes() {
  const { selectedNodeId, setSelectedNodeId, nodeContent } = useConceptContext()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const toggleNode = (nodeId: string) => {
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    } else {
      setSelectedNodeId(nodeId)
    }
  }

  return (
    <div className="relative w-full">
      {/* Main concept nodes bar */}
      <div className="flex items-center justify-center gap-3 p-4 bg-background/80 rounded-2xl border border-border backdrop-blur-sm shadow-sm">
        {conceptNodes.map((node, index) => {
          const Icon = node.icon
          const isSelected = selectedNodeId === node.id
          const isHovered = hoveredNode === node.id
          const hasContent = nodeContent[node.id]

          return (
            <div key={node.id} className="relative">
              {/* Connecting line to previous node */}
              {index > 0 && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-px bg-border" />
              )}

              {/* Node button */}
              <div className="relative">
                <div className="relative">
                  {/* Content indicator for nodes with content */}
                  {hasContent && (
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full border-2 animate-pulse cursor-pointer hover:scale-105 transition-transform duration-200',
                        node.color.replace('text-', 'border-')
                      )}
                      onClick={() => toggleNode(node.id)}
                      title={`${node.name} has content`}
                    />
                  )}

                  <Button
                    variant={isSelected ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleNode(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={cn(
                      'h-12 w-12 rounded-full p-0 transition-all duration-200 border-2 border-transparent hover:border-border',
                      isSelected && 'shadow-lg scale-110 border-primary',
                      !isSelected && 'hover:scale-105 hover:shadow-md',
                      hasContent && `ring-2 ring-${node.color.split('-')[1]}-400/50`
                    )}
                  >
                    <Icon className={cn('w-5 h-5', node.color)} />
                  </Button>
                </div>

                {/* Hover tooltip */}
                {isHovered && !isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                    <div className="bg-popover border border-border rounded-md shadow-lg px-2 py-1 whitespace-nowrap">
                      <span className="text-xs font-medium">{node.name}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                    </div>
                  </div>
                )}

                {/* Selection indicator line */}
                {isSelected && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-4 bg-border" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Single expanded preview */}
      {selectedNodeId && (
        <div className="mt-4">
          {(() => {
            const node = conceptNodes.find(n => n.id === selectedNodeId)
            if (!node) return null

            const Icon = node.icon
            const hasContent = nodeContent[selectedNodeId]

            return (
              <div className="bg-background border border-border rounded-xl p-4 shadow-lg backdrop-blur-sm relative max-w-md mx-auto">
                {/* Preview header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-4 h-4', node.color)} />
                    <h3 className="font-semibold text-sm">{node.name}</h3>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Selected for editing
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-3">
                  {node.description}
                </p>

                {/* Content status */}
                <div
                  className={cn(
                    'p-3 rounded-lg border-2 border-dashed flex items-center justify-center',
                    hasContent
                      ? `bg-${node.color.split('-')[1]}-50 border-${node.color.split('-')[1]}-200 dark:bg-${node.color.split('-')[1]}-950/20 dark:border-${node.color.split('-')[1]}-800`
                      : 'bg-muted/30 border-border'
                  )}
                >
                  <span
                    className={cn(
                      'text-xs text-center',
                      hasContent
                        ? `text-${node.color.split('-')[1]}-600 dark:text-${node.color.split('-')[1]}-400 font-medium`
                        : 'text-muted-foreground'
                    )}
                  >
                    {hasContent
                      ? `${node.name} content ready ✓`
                      : `Use the main editor below to develop your ${node.name.toLowerCase()} concept`}
                  </span>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
