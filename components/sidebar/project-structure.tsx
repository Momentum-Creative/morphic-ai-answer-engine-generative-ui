'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Music,
  Mic,
  Volume2,
  Video,
  Image,
  Plus,
  Tag,
  Zap,
  DollarSign,
  Crown,
  User,
  CheckSquare,
  Square
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNotificationActions } from '@/hooks/use-notification-actions'

interface MediaItem {
  id: string
  name: string
  type: 'music' | 'dialogue' | 'narration' | 'video' | 'image'
}

interface TodoItem {
  id: string
  name: string
  completed: boolean
}

interface FolderState {
  isExpanded: boolean
  items: MediaItem[]
  todos?: TodoItem[]
}

const getMediaIcon = (type: MediaItem['type']) => {
  switch (type) {
    case 'music':
      return <Music className="size-4 text-purple-500" />
    case 'dialogue':
      return <Mic className="size-4 text-blue-500" />
    case 'narration':
      return <Volume2 className="size-4 text-green-500" />
    case 'video':
      return <Video className="size-4 text-red-500" />
    case 'image':
      return <Image className="size-4 text-orange-500" />
  }
}

export function ProjectStructure() {
  const [folders, setFolders] = useState<Record<string, FolderState>>({
    'my-first-project': {
      isExpanded: false,
      items: [],
      todos: [
        { id: 't1', name: 'Finalize brand messaging', completed: false },
        { id: 't2', name: 'Review video timeline', completed: true },
        { id: 't3', name: 'Get stakeholder approval', completed: false }
      ]
    },
    briefs: {
      isExpanded: false,
      items: [
        { id: '1', name: 'Brand Guidelines', type: 'image' },
        { id: '2', name: 'Creative Brief.pdf', type: 'image' }
      ]
    },
    media: {
      isExpanded: false,
      items: [
        { id: '3', name: 'Background Music.mp3', type: 'music' },
        { id: '4', name: 'Voiceover Script', type: 'dialogue' },
        { id: '5', name: 'Hero Video.mp4', type: 'video' },
        { id: '6', name: 'Product Shot.jpg', type: 'image' }
      ]
    },
    reference: {
      isExpanded: false,
      items: [
        { id: '7', name: 'Competitor Analysis', type: 'image' },
        { id: '8', name: 'Style References', type: 'image' }
      ]
    }
  })

  const toggleFolder = (folderKey: string) => {
    setFolders(prev => ({
      ...prev,
      [folderKey]: {
        ...prev[folderKey],
        isExpanded: !prev[folderKey].isExpanded
      }
    }))
  }

  const subFolderConfigs = [
    { key: 'briefs', name: 'Briefs', icon: FileText },
    { key: 'media', name: 'Media', icon: Folder },
    { key: 'reference', name: 'Reference', icon: Folder }
  ]

  const stockTags = [
    {
      key: 'stock-free',
      name: 'Stock',
      icon: Tag,
      color: 'text-green-500',
      description: 'Commercially free'
    },
    {
      key: 'ai',
      name: 'AI',
      icon: Zap,
      color: 'text-purple-500',
      description: 'AI generated'
    },
    {
      key: 'stock-paid',
      name: 'Licenseable',
      icon: DollarSign,
      color: 'text-yellow-500',
      description: 'Licenseable stock'
    },
    {
      key: 'brand-footage',
      name: 'Brand Media',
      icon: Crown,
      color: 'text-blue-600',
      description: 'Company owned content'
    },
    {
      key: 'my-footage',
      name: 'My Media',
      icon: User,
      color: 'text-indigo-600',
      description: 'Personal media library'
    }
  ]

  return (
    <div className="space-y-2">
      {/* Project Header */}
      <div className="px-2 py-2">
        <div className="flex items-center justify-between mb-4 group/projects">
          <h3 className="text-sm font-semibold text-foreground/80">
            My Projects
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover/projects:opacity-100 transition-opacity h-auto p-1 text-muted-foreground hover:text-foreground"
            title="Add New Project"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Main Project Folder */}
      <div className="space-y-1 mt-2">
        <div className="space-y-1">
          {/* My First Project Header */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFolder('my-first-project')}
            className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent"
          >
            {folders['my-first-project']?.isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            {folders['my-first-project']?.isExpanded ? (
              <FolderOpen className="size-4 text-indigo-500" />
            ) : (
              <Folder className="size-4 text-indigo-500" />
            )}
            <span>My First Project</span>
          </Button>

          {/* Nested Subfolders */}
          {folders['my-first-project']?.isExpanded && (
            <div className="ml-6 space-y-1">
              {subFolderConfigs.map(({ key, name, icon: Icon }) => {
                const folder = folders[key]
                const isExpanded = folder?.isExpanded || false

                return (
                  <div key={key} className="space-y-1">
                    {/* Subfolder Header */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFolder(key)}
                      className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent"
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                      {isExpanded ? (
                        <FolderOpen className="size-4 text-blue-500" />
                      ) : (
                        <Icon className="size-4 text-blue-500" />
                      )}
                      <span>{name}</span>
                      <Plus className="size-3 ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground" />
                    </Button>

                    {/* Subfolder Contents */}
                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {folder.items.map(item => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent/50"
                          >
                            {getMediaIcon(item.type)}
                            <span className="truncate">{item.name}</span>
                          </Button>
                        ))}

                        {/* Add new item button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm text-muted-foreground hover:bg-accent/50"
                        >
                          <Plus className="size-4" />
                          <span>Add {name.toLowerCase()}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* To-do List Section */}
              <div className="ml-6 space-y-1 mt-3 pt-3 border-t border-border/30">
                <h5 className="text-xs font-medium text-muted-foreground px-2 mb-2">
                  To-Do
                </h5>
                {folders['my-first-project']?.todos?.map(todo => (
                  <Button
                    key={todo.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newFolders = { ...folders }
                      const todoIndex = newFolders[
                        'my-first-project'
                      ].todos!.findIndex(t => t.id === todo.id)
                      newFolders['my-first-project'].todos![
                        todoIndex
                      ].completed = !todo.completed
                      setFolders(newFolders)
                    }}
                    className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent/50"
                  >
                    {todo.completed ? (
                      <CheckSquare className="w-4 h-4 text-green-500" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        'truncate',
                        todo.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {todo.name}
                    </span>
                  </Button>
                ))}

                {/* Add new todo button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm text-muted-foreground hover:bg-accent/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add task</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stock/AI Tags Section */}
      <div className="px-2 py-4 border-t border-border/50">
        <h4 className="text-xs font-medium text-muted-foreground mb-3">
          Content Sources
        </h4>
        <div className="space-y-2">
          {stockTags.map(({ key, name, icon: Icon, color, description }) => (
            <div key={key} className="relative group/content-source">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent/50"
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', color)} />
                <span className="text-foreground">{name}</span>
              </Button>

              {/* Improved tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 group-hover/content-source:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-popover border border-border rounded-md shadow-lg px-2 py-1 whitespace-nowrap">
                  <span className="text-xs text-popover-foreground font-medium">
                    {description}
                  </span>
                  {/* Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Type Legend */}
      <div className="px-2 py-4 border-t border-border/50 mt-6">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">
          Media Types
        </h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <Music className="size-3 text-purple-500" />
            <span className="text-muted-foreground">Music</span>
          </div>
          <div className="flex items-center gap-1">
            <Mic className="size-3 text-blue-500" />
            <span className="text-muted-foreground">Dialogue</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="size-3 text-green-500" />
            <span className="text-muted-foreground">Narration</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="size-3 text-red-500" />
            <span className="text-muted-foreground">Video</span>
          </div>
          <div className="flex items-center gap-1">
            <Image className="size-3 text-orange-500" />
            <span className="text-muted-foreground">Image</span>
          </div>
        </div>
      </div>
    </div>
  )
}
