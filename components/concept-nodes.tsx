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
  ClipboardList,
  Plus,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [showTextInput, setShowTextInput] = useState<Set<string>>(new Set())
  const [nodesWithContent, setNodesWithContent] = useState<Set<string>>(new Set(['references'])) // Demo: references has content

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
      // Also remove text input when collapsing
      const newTextInput = new Set(showTextInput)
      newTextInput.delete(nodeId)
      setShowTextInput(newTextInput)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const toggleTextInput = (nodeId: string) => {
    const newTextInput = new Set(showTextInput)
    if (newTextInput.has(nodeId)) {
      newTextInput.delete(nodeId)
    } else {
      newTextInput.add(nodeId)
    }
    setShowTextInput(newTextInput)
  }

  const saveContent = (nodeId: string, content: string) => {
    if (content.trim()) {
      // Mark node as having content
      const newNodesWithContent = new Set(nodesWithContent)
      newNodesWithContent.add(nodeId)
      setNodesWithContent(newNodesWithContent)

      // Close text input
      const newTextInput = new Set(showTextInput)
      newTextInput.delete(nodeId)
      setShowTextInput(newTextInput)
    }
  }

  return (
    <div className="relative w-full">
      {/* Main concept nodes bar */}
      <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-2xl border border-border backdrop-blur-sm">
        {conceptNodes.map((node, index) => {
          const Icon = node.icon
          const isExpanded = expandedNodes.has(node.id)
          const isHovered = hoveredNode === node.id

          return (
            <div key={node.id} className="relative">
              {/* Connecting line to previous node */}
              {index > 0 && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-px bg-border" />
              )}

              {/* Node button */}
              <div className="relative">
                <div className="relative">
                  {/* Thin circle indicator for nodes with content */}
                  {nodesWithContent.has(node.id) && (
                    <div className={cn(
                      "absolute inset-0 rounded-full border-2 animate-pulse",
                      node.color.replace('text-', 'border-')
                    )} />
                  )}

                  <Button
                    variant={isExpanded ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => toggleNode(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={cn(
                      'h-10 w-10 rounded-full p-0 transition-all duration-200',
                      isExpanded && 'shadow-lg scale-110',
                      nodesWithContent.has(node.id) && `ring-1 ring-${node.color.split('-')[1]}-400/50`
                    )}
                  >
                    <Icon className={cn('w-4 h-4', node.color)} />
                  </Button>
                </div>

                {/* Hover tooltip */}
                {isHovered && !isExpanded && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                    <div className="bg-popover border border-border rounded-md shadow-lg px-2 py-1 whitespace-nowrap">
                      <span className="text-xs font-medium">{node.name}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                    </div>
                  </div>
                )}

                {/* Connecting line to expanded window */}
                {isExpanded && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-4 bg-border" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded windows */}
      {expandedNodes.size > 0 && (
        <div
          className="mt-4 grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(expandedNodes.size, 3)}, 1fr)`
          }}
        >
          {Array.from(expandedNodes).map(nodeId => {
            const node = conceptNodes.find(n => n.id === nodeId)
            if (!node) return null

            const Icon = node.icon

            return (
              <div
                key={nodeId}
                className="bg-background border border-border rounded-xl p-4 shadow-lg backdrop-blur-sm relative"
                style={{ minHeight: '200px' }}
              >
                {/* Window header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-4 h-4', node.color)} />
                    <h3 className="font-semibold text-sm">{node.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNode(nodeId)}
                    className="h-6 w-6 p-0 hover:bg-destructive/10"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {/* Window content */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {node.description}
                  </p>

                  {/* Placeholder content areas */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTextInput(nodeId)}
                      className="flex items-center gap-2 h-auto p-2 w-full justify-start hover:bg-accent/50"
                    >
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Add {node.name.toLowerCase()} details
                      </span>
                    </Button>

                    {/* Animated text input window */}
                    {showTextInput.has(nodeId) && (
                      <div className="animate-in slide-in-from-top-2 duration-300 space-y-2">
                        <textarea
                          id={`textarea-${nodeId}`}
                          placeholder={`Enter ${node.name.toLowerCase()} details...`}
                          className="w-full h-20 p-2 text-xs bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button
                            variant="default"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                              const textarea = document.getElementById(`textarea-${nodeId}`) as HTMLTextAreaElement
                              if (textarea) {
                                saveContent(nodeId, textarea.value)
                              }
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => toggleTextInput(nodeId)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!showTextInput.has(nodeId) && (
                      <div className={cn(
                        "h-20 rounded-lg border-2 border-dashed flex items-center justify-center",
                        nodesWithContent.has(nodeId)
                          ? `bg-${node.color.split('-')[1]}-50 border-${node.color.split('-')[1]}-200 dark:bg-${node.color.split('-')[1]}-950/20 dark:border-${node.color.split('-')[1]}-800`
                          : "bg-muted/30 border-border"
                      )}>
                        <span className={cn(
                          "text-xs",
                          nodesWithContent.has(nodeId)
                            ? `text-${node.color.split('-')[1]}-600 dark:text-${node.color.split('-')[1]}-400 font-medium`
                            : "text-muted-foreground"
                        )}>
                          {nodesWithContent.has(nodeId)
                            ? `${node.name} content added ✓`
                            : "Drop content here"
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-1 pt-2">
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      Import
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
